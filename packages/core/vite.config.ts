import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'StripeLoadersCore',
      fileName: 'stripe-loaders-core',
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    outDir: 'dist',
  },
}); 