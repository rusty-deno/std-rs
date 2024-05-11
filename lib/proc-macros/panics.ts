
import { Fn } from '../types.ts';
import { ClassMethodDecorator } from "./types.ts";
import { $panic } from "../declarative-macros/mod.ts";



/**
 * Causes the program to panic if the {@linkcode condition} satisfies.
 */
// deno-lint-ignore no-explicit-any
export function panics<P extends any[],R>(condition: boolean,msg?: string): ClassMethodDecorator<P,R> {
  return function(fn: Fn<P,R>,_context: ClassMethodDecoratorContext): Fn<P,R> {
    return function(...args: P): R {
      return condition?$panic(msg):fn(...args);
    };
  };
}


