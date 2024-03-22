// deno-lint-ignore-file no-explicit-any
// deno-lint-ignore no-unused-vars
import { Clone } from "../clone.ts";
import { Class } from "./types.ts";




export function Clone<T extends Class>(constructor: T,_: any): T {
  return class extends constructor implements Clone {
    public clone() {
      const clone={} as any;
      for(const [key,val] of Object.entries(this)) {
        clone[key]=val.clone instanceof Function?val.clone():structuredClone(val);
      }

      return clone;
    }
  };
}


