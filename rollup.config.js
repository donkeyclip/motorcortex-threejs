import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
export default [
  {
    inlineDynamicImports: false,
    input: "src/index.js",
    external: ["@donkeyclip/motorcortex"],
    output: [
      { dir: pkg.main, format: "cjs" },
      { dir: pkg.module, format: "es" },
    ],
    plugins: [resolve(), commonjs(), babel()],
  },
  {
    input: "src/index.js",
    external: ["@donkeyclip/motorcortex"],
    output: [
      {
        globals: {
          "@donkeyclip/motorcortex": "MotorCortex",
        },
        inlineDynamicImports: true,
        name: pkg.name,
        file: pkg.browser,
        format: "umd",
      },
    ],
    plugins: [
      resolve({ mainFields: ["module", "main", "browser"] }),
      commonjs(),
      babel(),
      cleanup({ comments: "none" }),
      terser(),
    ],
  },
];
