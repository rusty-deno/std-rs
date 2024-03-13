// deno-lint-ignore no-unused-vars
import { Clone } from "../clone.ts";
import { Class } from "./types.ts";




// deno-lint-ignore no-explicit-any
export function Clone<C extends Class>(constructor: C,_: any) {
  return class extends constructor implements Clone {
    clone(): C {
      return structuredClone(this);
    }
  };
}


