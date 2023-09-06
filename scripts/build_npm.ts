// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  importMap: "./deno.json",
  declaration: false,
  scriptModule: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@zyland/core",
    version: Deno.args[0],
    description: "TypeScript implement of Zy.",
    //license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/zyland/Zy.js.git",
    },
    bugs: {
      url: "https://github.com/zyland/Zy.js/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    //Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});