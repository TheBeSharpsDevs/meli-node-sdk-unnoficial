import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: './src/index.ts',
    auth: './src/auth.ts',
    errors: './src/errors.ts',
    base: './src/base.ts'
  },
  clean: true,
  cjsInterop: true,
  dts: true,
  format: ['cjs', 'esm'],
  outExtension({ format }) {
    console.log({format})
    return {
      js: `.${format === "cjs" ? "cjs" : "js"}`,
    }
  },
  outDir: 'lib',
  keepNames: true,
  target: 'es2020',
  platform: 'node',
})