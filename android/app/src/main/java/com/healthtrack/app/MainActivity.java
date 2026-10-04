package com.healthtrack.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private static final String CONFIG_ASSET = "config.yaml";
    // 保持与 Go 配置结构一致；AI 的详细配置由服务端默认值补全。
    private static final String FALLBACK_CONFIG = "server:\n"
            + "  port: 8080\n"
            + "ai: {}\n"
            // 保留 ai_config 空节点，兼容旧版/外部配置约定；当前服务读取 ai 节点。
            + "ai_config: {}\n";
    private static final String CONFIG_FILE = "config.yaml";
    private static final String HEALTH_URL = "http://127.0.0.1:8080/healthz";
    private static final String APP_URL = "http://127.0.0.1:8080";

    private final ExecutorService startupExecutor = Executors.newSingleThreadExecutor();
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private WebView webView;
    private TextView statusView;
    private Process serverProcess;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestLegacyStoragePermissionIfNeeded();
        enableFullscreen();
        setContentView(createContentView());
        startServerAndLoadWebView();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private View createContentView() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.WHITE);

        webView = new WebView(this);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(false);
        webView.getSettings().setAllowContentAccess(false);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }
        });
        // 拦截导出 CSV 下载（Content-Disposition: attachment），交由系统 DownloadManager 处理。
        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                handleExportDownload(url, contentDisposition);
            }
        });
        // 暴露导出辅助桥：网页可调用 window.HealthTrack.openDownloads() 跳到系统下载目录。
        webView.addJavascriptInterface(new ExportBridge(), "HealthTrack");
        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        statusView = new TextView(this);
        statusView.setText("正在启动 HealthTrack…");
        statusView.setTextColor(Color.rgb(71, 85, 105));
        statusView.setTextSize(16);
        statusView.setGravity(Gravity.CENTER);
        statusView.setPadding(36, 24, 36, 24);
        statusView.setBackgroundColor(Color.WHITE);
        root.addView(statusView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        return root;
    }

    private void enableFullscreen() {
        Window window = getWindow();
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    private void startServerAndLoadWebView() {
        startupExecutor.execute(() -> {
            try {
                File filesDir = getFilesDir();
                File configFile = new File(filesDir, CONFIG_FILE);
                File serverBin = new File(getApplicationInfo().nativeLibraryDir, "libhealthtrack.so");

                // 用户已修改的配置不能被 APK 更新覆盖。
                if (!configFile.exists()) {
                    copyConfigAssetOrWriteFallback(configFile);
                }

                // 原生库目录由系统解压并允许执行；filesDir 在部分设备上带 noexec 挂载。
                if (!serverBin.exists()) {
                    throw new IOException("未找到原生二进制库，路径: " + serverBin.getAbsolutePath());
                }
                startServer(serverBin, configFile, filesDir);

                if (!waitForServer()) {
                    throw new IOException("服务未能在 15 秒内启动。请重新打开应用。\n日志：" + new File(filesDir, "server.log"));
                }

                mainHandler.post(() -> {
                    statusView.setVisibility(View.GONE);
                    webView.loadUrl(APP_URL);
                });
            } catch (Exception error) {
                mainHandler.post(() -> showStartupError(error));
            }
        });
    }

    private void startServer(File serverBin, File configFile, File filesDir) throws IOException {
        if (serverProcess != null && serverProcess.isAlive()) {
            return;
        }

        ProcessBuilder processBuilder = new ProcessBuilder(Arrays.asList(
                serverBin.getAbsolutePath(),
                "-config", configFile.getAbsolutePath(),
                "-data-dir", filesDir.getAbsolutePath(),
                "-port", "8080"));
        processBuilder.directory(filesDir);
        processBuilder.redirectErrorStream(true);
        processBuilder.redirectOutput(ProcessBuilder.Redirect.appendTo(new File(filesDir, "server.log")));
        serverProcess = processBuilder.start();
    }

    private boolean waitForServer() {
        for (int attempt = 0; attempt < 60; attempt++) {
            if (serverProcess == null || !serverProcess.isAlive()) {
                return false;
            }
            if (isHealthy()) {
                return true;
            }
            try {
                Thread.sleep(250);
            } catch (InterruptedException error) {
                Thread.currentThread().interrupt();
                return false;
            }
        }
        return false;
    }

    private boolean isHealthy() {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(HEALTH_URL).openConnection();
            connection.setConnectTimeout(500);
            connection.setReadTimeout(500);
            connection.setRequestMethod("GET");
            return connection.getResponseCode() == HttpURLConnection.HTTP_OK;
        } catch (IOException ignored) {
            return false;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private void writeBundledConfig(File target) throws IOException {
        File temporary = new File(target.getParentFile(), target.getName() + ".tmp");
        try (InputStream input = getAssets().open(CONFIG_ASSET);
             FileOutputStream output = new FileOutputStream(temporary, false)) {
            byte[] buffer = new byte[16 * 1024];
            int count;
            while ((count = input.read(buffer)) != -1) {
                output.write(buffer, 0, count);
            }
            output.getFD().sync();
        }

        if (target.exists() && !target.delete()) {
            throw new IOException("无法替换文件: " + target.getAbsolutePath());
        }
        if (!temporary.renameTo(target)) {
            try (InputStream input = new FileInputStream(temporary);
                 FileOutputStream output = new FileOutputStream(target, false)) {
                byte[] buffer = new byte[16 * 1024];
                int count;
                while ((count = input.read(buffer)) != -1) {
                    output.write(buffer, 0, count);
                }
            }
            if (!temporary.delete()) {
                temporary.deleteOnExit();
            }
        }
    }

    /**
     * APK 构建配置异常时，assets 中可能没有 config.yaml。配置缺失不能阻断
     * 首次启动，因此仅对该资产使用安全的本地默认配置兜底。
     */
    private void copyConfigAssetOrWriteFallback(File target) throws IOException {
        try {
            writeBundledConfig(target);
        } catch (FileNotFoundException error) {
            writeTextAtomically(FALLBACK_CONFIG, target);
        }
    }

    private void writeTextAtomically(String content, File target) throws IOException {
        File temporary = new File(target.getParentFile(), target.getName() + ".tmp");
        try (FileOutputStream output = new FileOutputStream(temporary, false)) {
            output.write(content.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            output.getFD().sync();
        }

        if (target.exists() && !target.delete()) {
            throw new IOException("无法替换文件: " + target.getAbsolutePath());
        }
        if (!temporary.renameTo(target)) {
            try (InputStream input = new FileInputStream(temporary);
                 FileOutputStream output = new FileOutputStream(target, false)) {
                byte[] buffer = new byte[16 * 1024];
                int count;
                while ((count = input.read(buffer)) != -1) {
                    output.write(buffer, 0, count);
                }
                output.getFD().sync();
            }
            if (!temporary.delete()) {
                temporary.deleteOnExit();
            }
        }
    }

    private void showStartupError(Exception error) {
        statusView.setText("HealthTrack 启动失败\n\n" + error.getMessage());
    }

    private void requestLegacyStoragePermissionIfNeeded() {
        if (Build.VERSION.SDK_INT <= 28
                && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1001);
        }
    }

    private void handleExportDownload(String url, String contentDisposition) {
        String filename = extractFilename(contentDisposition);
        if (filename == null || filename.isEmpty()) {
            filename = "HealthTrack_export.csv";
        }
        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle(filename);
            request.setMimeType("text/csv");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            // Android 10+ 分区存储下无需 WRITE_EXTERNAL_STORAGE 即可写入公共下载目录。
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
            DownloadManager manager = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            manager.enqueue(request);
            postExportResult(true, filename, "下载目录 Download/");
            Toast.makeText(this, "已开始导出：" + filename, Toast.LENGTH_SHORT).show();
        } catch (Exception error) {
            postExportResult(false, null, "导出启动失败：" + error.getMessage());
            Toast.makeText(this, "导出失败：" + error.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

    private void postExportResult(final boolean ok, final String filename, final String message) {
        try {
            JSONObject object = new JSONObject();
            object.put("ok", ok);
            if (filename != null) {
                object.put("filename", filename);
                object.put("location", "下载目录 Download/");
            }
            if (message != null) {
                object.put("message", message);
            }
            final String script = "if (window.onExportResult) window.onExportResult(" + object.toString() + ");";
            mainHandler.post(new Runnable() {
                @Override
                public void run() {
                    webView.evaluateJavascript(script, null);
                }
            });
        } catch (Exception ignored) {
            // JS 回调失败不影响下载本身。
        }
    }

    private String extractFilename(String contentDisposition) {
        if (contentDisposition == null) {
            return null;
        }
        Matcher matcher = Pattern.compile("filename=\"?([^\";]+)\"?", Pattern.CASE_INSENSITIVE).matcher(contentDisposition);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private final class ExportBridge {
        @android.webkit.JavascriptInterface
        public void openDownloads() {
            try {
                Intent intent = new Intent(DownloadManager.ACTION_VIEW_DOWNLOADS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception ignored) {
                Toast.makeText(MainActivity.this, "未找到系统下载管理器", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (serverProcess != null) {
            serverProcess.destroy();
            try {
                if (!serverProcess.waitFor(2, java.util.concurrent.TimeUnit.SECONDS)) {
                    serverProcess.destroyForcibly();
                }
            } catch (InterruptedException error) {
                Thread.currentThread().interrupt();
                serverProcess.destroyForcibly();
            }
            serverProcess = null;
        }
        startupExecutor.shutdownNow();
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
