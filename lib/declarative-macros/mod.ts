export * from "./collections.ts";
export * from "./panics.ts";
export * from "./net.ts";
export * from "./test/mod.ts";

/** Constructs a promise with {@linkcode T} value */
export function $promise<T>(promise: T): Promise<T> {
  return new Promise(resolve=> resolve(promise));
}


