import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'web/src',
  base: './', // 确保生成相对路径，完美适配 Android WebView 和本地嵌入
  build: {
    outDir: path.resolve(__dirname, 'web/static'),
    emptyOutDir: false, // 保护 vendor 等既有离线资源
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
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
