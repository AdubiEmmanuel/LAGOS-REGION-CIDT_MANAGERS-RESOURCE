import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  server: {
    proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: true, secure: false } }
  }
});
