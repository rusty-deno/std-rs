import { Vec } from "../../../mod.ts";

/**
 * Constructs a {@linkcode Vec}
 */
export function $vec<T>(...iter: T[]) {
  return new Vec(...iter);
}