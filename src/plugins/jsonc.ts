import type { Plugin } from "vite";
import stripJsonComments from "strip-json-comments";
import { readFileSync } from "fs";

export function jsoncPlugin(): Plugin {
  return {
    name: "jsonc",
    load(id) {
      if (id.endsWith(".jsonc")) {
        const content = readFileSync(id, "utf-8");
        const stripped = stripJsonComments(content);
        return `export default ${stripped}`;
      }
    },
  };
}
