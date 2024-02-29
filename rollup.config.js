const ts = require('rollup-plugin-ts');
const terser = require('@rollup/plugin-terser');

const config = require('./tsconfig.json');

module.exports = {
  input: './src/index.ts',
  output: [
    {
      file: './extension/MoodleGPT.js',
      format: 'umd',
      sourcemap: true
    }
  ],
  plugins: [ts(config), terser()]
};
