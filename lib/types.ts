
// deno-lint-ignore no-explicit-any
type Params=Array<any>;

/** The function type. */
export interface Fn<P extends Params,R> {
  (...args: P): R;
}

/** The async function type */
export interface AsyncFn<P extends Params,R> {
  (...args: P): Promise<R>;
}

/** The enum type */
export type Enum<T>={// This exists cause typescript sucks at compiling enums.
  readonly [varient: PropertyKey]: T;
}
