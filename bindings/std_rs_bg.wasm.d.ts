/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function spawn_thread(a: number, b: number, c: number): number;
export function available_parallelism(): number;
export function current_thread(): number;
export function thread_panicking(): number;
export function park_thread(): void;
export function park_thread_with_timeout(a: number): void;
export function sleep(a: number): void;
export function yield_now(): void;
export function is_finished(a: number): number;
export function thread(a: number): number;
export function join(a: number): void;
export function thread_id(a: number): number;
export function thread_name(a: number, b: number): void;
export function drop_thread(a: number): void;
export function drop_join_handle(a: number): void;
export function thread_unpark(a: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
