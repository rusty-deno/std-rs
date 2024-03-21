
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

\@derive(Clone) // idk `\@` should be replaced with `@`
class Reading<T> {
      constructor(public frequency: T) {...}
}
```
 * How can I implement Clone?
 * Types that are {@linkcode Copy} should have a trivial implementation of Clone.
 * 
 * Manual implementations should be careful to uphold this invariant; however, unsafe code must not rely on it to ensure memory safety.
 */
export interface Clone {
  /**
   * Returns a clone of the current object
   */
  clone(): unknown;
}



