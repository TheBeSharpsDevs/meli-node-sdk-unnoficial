import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  cjsInterop: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'lib',
  keepNames: true,
  target: 'es2020',
  platform: 'node',
  terserOptions: {
    compress: false,
    module: true
  }
})