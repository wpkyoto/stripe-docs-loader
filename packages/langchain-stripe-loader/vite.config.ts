import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LangchainStripeLoader',
      fileName: 'langchain-stripe-loader',
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      output: {
        exports: 'named'
      }
    }
  },
}); 