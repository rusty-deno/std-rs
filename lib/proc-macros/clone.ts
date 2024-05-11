// deno-lint-ignore-file no-explicit-any
// deno-lint-ignore no-unused-vars
import type { Clone } from "../clone.ts";
import { Class,ClassDecorator } from "./types.ts";

/**
 * A common interface for the ability to explicitly duplicate an object.
 * 
 * ### Derivable
 * This interface can be used with `@derive`.
 * The derived implementation of {@linkcode Clone} calls {@linkcode clone} on each field.
 * 
```ts
// `derive` implements Clone for Reading<T> when T is Clone.
import { Clone } from "@std";
import { ClassDecorator } from './types';

\@derive(Clone) // idk `\@` should be replaced with `@`
class Reading<T> implements Clone {
      constructor(public frequency: T) {...}
      
      public clone(): this {
        $unimplemented();
      }
}
```
 * How can I implement Clone?
 * Types that are {@linkcode Copy} should have a trivial implementation of Clone.
 * 
 * Manual implementations should be careful to uphold this invariant; however, unsafe code must not rely on it to ensure memory safety.
 */
export function Clone<C extends Class>(klass: C,_context: ClassDecoratorContext): ClassDecorator<C> {
  return class extends klass implements Clone {
    clone(): this {
      const clone={} as this;

      for(const [key,val] of Object.entries(this)) {
        clone[key as keyof typeof this]=typeof val.clone==="function"?val.clone():structuredClone(val);
      }

      for(const sym of Object.getOwnPropertySymbols(this)) {
        const val=this[sym as keyof typeof this] as any;
        clone[sym as keyof typeof this]=typeof val.clone==="function"?val.clone():structuredClone(val);
      }

      return clone;
    }
  };
}


