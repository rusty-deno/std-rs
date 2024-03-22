// deno-lint-ignore-file
import { Thread } from "./thread.ts";
import { AsyncFn } from '../types.ts';


/**
 * Makes the function spawn a call itself in a different thread.
 */
// TODO(kakashi): implement async-thread-spawn.
export function thread<P extends unknown[],T>(fn: AsyncFn<P,T>,_: ClassMethodDecoratorContext) {
  return async function(...args: P) {
    return await fn(...args);
  };
};
