const ts = require('@rollup/plugin-typescript');
const terser = require('@rollup/plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');

const config = require('./tsconfig.json');

module.exports = [
  {
    input: './src/background/index.ts',
    output: {
      file: './extension/MoodleGPT.js',
      format: 'umd',
      sourcemap: true
    },
    onwarn() {},
    plugins: [nodeResolve(), ts(config), terser()]
  },

  {
    input: './src/popup/index.ts',
    output: {
      file: './extension/popup/popup.js',
      format: 'umd',
      sourcemap: true
    },
    onwarn() {},
    plugins: [nodeResolve(), ts(config), terser()]
  }
];
