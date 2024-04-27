
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
export type Enum<E>=E[keyof E];// This exists cause typescript sucks at compiling enums.

/**
 * An {@linkcode Iterable} type that may or may not be an array. For example a {@linkcode Vec}
 */
export interface ArrayLite<T> extends ArrayLike<T> {
  [Symbol.iterator](): Iterator<T>;
}

