import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function cleanAssetsPlugin() {
  return {
    name: 'clean-static-assets',
    apply: 'build',
    buildStart() {
      const assetsDir = path.resolve(__dirname, 'web/static/assets');
      fs.rmSync(assetsDir, { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  root: 'web/src',
  base: './', // 确保生成相对路径，完美适配 Android WebView 和本地嵌入
  css: {
    postcss: __dirname,
  },
  plugins: [cleanAssetsPlugin()],
  build: {
    outDir: path.resolve(__dirname, 'web/static'),
    emptyOutDir: false, // 保护 vendor 等既有离线资源
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
});
