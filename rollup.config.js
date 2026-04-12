import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import terser from "@rollup/plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import { spawn } from "child_process";

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),
    postcss({ extract: true }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    !production && serve(),

    !production && livereload("public"),

    production && terser(),

    copy({
      targets: [
        {
          src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
          dest: "public/vendor/bootstrap/",
        },
        {
          src: "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
          dest: "public/vendor/bootstrap/",
        },
        {
          src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
          dest: "public/vendor/bootstrap/",
        },
      ],
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
