import { Thread } from "./thread.ts";
import { $resultSync } from "../error/result/macros.ts";
import * as lib from '../../bindings/std_rs.js';



////////////////////////////////////////////////////////////////////////////////
// Free functions
////////////////////////////////////////////////////////////////////////////////


export function spawn<T>(f: ()=> T,name?: string) {
  return Thread.spawn(f,name);
}

export function availableParallelism() {
  return $resultSync(lib.available_parallelism);
}

export function current() {
  return Thread.current();
}

export function panicking() {
  return lib.thread_panicking();
}

export function park() {
  lib.park_thread();
}

export function parkWithTimeout(dur: number|bigint) {
  lib.park_thread_with_timeout(BigInt(dur));
}

export function sleep(dur: number|bigint) {
  lib.sleep(BigInt(dur));
}

export function yieldNow() {
  lib.yield_now();
}


export * from "./thread.ts";