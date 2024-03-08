import { Vec } from "../../../std/mod.ts";

/**
 * Constructs a {@linkcode Vec}
 */
export function $vec<T>(...iter: T[]) {
  return Vec.fromArr(iter);
}