import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    main: './src/index.ts',
    auth: './src/auth/index.ts',
    errors: './src/errors/index.ts',
    base: './src/base.ts'
  },
  sourcemap: true,
  clean: true,
  cjsInterop: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'lib',
  keepNames: true,
  target: 'es2020',
  platform: 'node',
  bundle: true,
})