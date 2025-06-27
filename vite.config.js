import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    proxy: {
      '/miniprogram/api/': {
        target: 'https://uda-products.yundasys.com',
        changeOrigin: true,
      },
    },
  },
});
