const ts = require("rollup-plugin-ts");

const config = require("./tsconfig.json");

module.exports = {
  input: "./src/index.ts",
  output: [
    {
      file: "./extension/moodle-gpt.js",
      format: "umd",
      sourcemap: true,
    },
  ],
  plugins: [ts(config)],
};
