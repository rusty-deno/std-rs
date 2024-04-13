/* tslint:disable */
/* eslint-disable */
/**
* @returns {number}
*/
export function new_vec(): number;
/**
* @param {number} capacity
* @returns {number}
*/
export function new_vec_with_capacity(capacity: number): number;
/**
* @param {any[]} vec
* @returns {number}
*/
export function vec_from_iter(vec: any[]): number;
/**
* @param {number} _this
* @param {any} element
* @returns {number}
*/
export function vec_push(_this: number, element: any): number;
/**
* @param {number} _this
* @param {any} element
* @returns {number}
*/
export function vec_push_front(_this: number, element: any): number;
/**
* @param {number} _this
* @returns {any}
*/
export function vec_pop(_this: number): any;
/**
* @param {number} _this
* @returns {any}
*/
export function vec_pop_front(_this: number): any;
/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_at(_this: number, index: number): any;
/**
* @param {number} _this
* @returns {number}
*/
export function vec_len(_this: number): number;
/**
* @param {number} _this
* @returns {number}
*/
export function vec_capacity(_this: number): number;
/**
* @param {number} _this
* @param {number} i
* @returns {any}
*/
export function vec_index(_this: number, i: number): any;
/**
* @param {number} _this
* @param {number} index
* @param {any} element
* @returns {number}
*/
export function vec_set(_this: number, index: number, element: any): number;
/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {any[]} replace_with
* @returns {number}
*/
export function vec_splice_arr(_this: number, start: number, count: number, replace_with: any[]): number;
/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {number} replace_with
* @returns {number}
*/
export function vec_splice_vec(_this: number, start: number, count: number, replace_with: number): number;
/**
* @param {number} _this
* @param {number} at
* @returns {number}
*/
export function vec_split_off(_this: number, at: number): number;
/**
* @param {number} _this
* @param {number} other
* @returns {number}
*/
export function vec_append(_this: number, other: number): number;
/**
* @param {number} _this
*/
export function vec_clear(_this: number): void;
/**
* @param {number} _this
* @param {number} i
* @param {any} element
* @returns {number}
*/
export function vec_insert(_this: number, i: number, element: any): number;
/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_remove(_this: number, index: number): any;
/**
* @param {number} _this
* @param {number} min_capacity
*/
export function vec_shrink_to(_this: number, min_capacity: number): void;
/**
* @param {number} _this
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function vec_swap(_this: number, a: number, b: number): number;
/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_swap_remove(_this: number, index: number): any;
/**
* @param {number} ptr
*/
export function drop_vec(ptr: number): void;
/**
* @param {number} ptr
* @param {string | undefined} [name]
* @returns {number}
*/
export function spawn_thread(ptr: number, name?: string): number;
/**
* @returns {number}
*/
export function available_parallelism(): number;
/**
* @returns {number}
*/
export function current_thread(): number;
/**
* @returns {boolean}
*/
export function thread_panicking(): boolean;
/**
*/
export function park_thread(): void;
/**
* @param {bigint} dur
*/
export function park_thread_with_timeout(dur: bigint): void;
/**
* @param {bigint} dur
*/
export function sleep(dur: bigint): void;
/**
*/
export function yield_now(): void;
/**
* @param {number} _this
* @returns {boolean}
*/
export function is_finished(_this: number): boolean;
/**
* @param {number} _this
* @returns {number}
*/
export function thread(_this: number): number;
/**
* @param {number} _this
*/
export function join(_this: number): void;
/**
* @param {number} _this
* @returns {bigint}
*/
export function thread_id(_this: number): bigint;
/**
* @param {number} _this
*/
export function thread_unpark(_this: number): void;
/**
* @param {number} _this
* @returns {string | undefined}
*/
export function thread_name(_this: number): string | undefined;
/**
* @param {number} this_ptr
*/
export function drop_thread(this_ptr: number): void;
/**
* @param {number} this_ptr
*/
export function drop_join_handle(this_ptr: number): void;
