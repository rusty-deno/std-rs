// deno-lint-ignore-file
import { $unimplemented } from "../declarative-macros/mod.ts";
import { Thread } from "./thread.ts";


/**
 * Makes the function spawn a call itself in a different thread.
 */
export function thread<T>(_target: Object,_key: keyof any,descriptor: PropertyDescriptor): PropertyDescriptor {
  // descriptor.value=function(...args: unknown[]) {
  //   return Thread.spawn<T>(()=> descriptor.value!(...args));
  // };
  // return descriptor;
  return $unimplemented();
};

