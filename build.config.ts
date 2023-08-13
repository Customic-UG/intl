import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  rollup: {
    emitCJS: true,
  },
  externals: ["next", "type-fest"],
  declaration: true
});
