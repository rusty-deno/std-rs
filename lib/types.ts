
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

