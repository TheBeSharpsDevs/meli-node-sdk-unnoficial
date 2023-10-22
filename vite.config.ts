// vite.config.js
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    dts({
    insertTypesEntry: false,
  })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        index: "./src/index.ts",
        auth: "./src/auth/index.ts",
        errors: "./src/errors/index.ts",
        common: "./src/common/index.ts"
      },
      name: 'ExampleNpm',
      // the proper extensions will be added
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${extension}`;
      },
      formats: ['cjs', 'es'],
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        exports: 'auto',
        preserveModules: false,
        inlineDynamicImports: false,
      },
      plugins: [
        nodePolyfills()
      ]
    },
  },
})