// deno-lint-ignore-file
import { Thread } from "./thread.ts";
import { AsyncPropertyDescriptor } from "../proc-macros/types.ts";



export function thread<T>(_target: Object,_key: keyof any,descriptor: AsyncPropertyDescriptor<T>) {
  descriptor.value=async function(...args: unknown[]) {
    return Thread.spawn(()=> descriptor.value!(...args));
  };
  return descriptor;
};

