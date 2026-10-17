import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    external: ['vs_utils'],
    input: `src/ui_utils/index.ts`,
    plugins: [esbuild({
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      tsconfig: 'src/tsconfig.json'
    })],
    output: [
      {
        file: `dist/vs_ui_utils.es.js`,
        format: 'es',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: `dist/vs_ui_utils.amd.js`,
        format: 'amd',
        name: 'vs_ui_utils',
        sourcemap: true,
        exports: 'named',
      },
    ]
  },
  {
    input: `build/ui_utils/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `dist/vs_ui_utils.d.ts`,
      format: 'es',
    },
  }
];