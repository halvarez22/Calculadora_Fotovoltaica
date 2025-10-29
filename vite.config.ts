import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          input: {
            main: './index.html'
          },
          output: {
            manualChunks: undefined
          }
        },
        cssCodeSplit: false,
        minify: false,
        sourcemap: false,
        emptyOutDir: true,
        lib: false,
        target: 'esnext',
        ssr: false,
        modulePreload: {
          polyfill: false,
        },
        reportCompressedSize: false,
        watch: null,
        commonjsOptions: {
          include: [],
        },
        write: true,
        inlineDynamicImports: false,
        preserveEntrySignatures: 'strict',
        treeshake: false,
        manifest: false,
        skipWrite: false,
        copyPublicDir: true,
      },
      esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
      },
      css: {
        devSourcemap: true,
        postcss: {},
      },
    };
});
