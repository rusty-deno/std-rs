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
* @param {number} other
* @returns {number}
*/
export function vec_append(_this: number, other: number): number;
/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_at(_this: number, index: number): any;
/**
* @param {number} _this
* @returns {Slice}
*/
export function vec_as_slice(_this: number): Slice;
/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function vec_binary_search_by(_this: number, f: Function): number;
/**
* @param {number} _this
* @returns {number}
*/
export function vec_capacity(_this: number): number;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_chunks_by(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_chunks(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_chunks_exact(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {any} element
* @returns {boolean}
*/
export function vec_contains(_this: number, element: any): boolean;
/**
* @param {number} _this
*/
export function vec_clear(_this: number): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function vec_dedup(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {any} element
*/
export function vec_fill(_this: number, element: any): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function vec_fill_with(_this: number, f: Function): void;
/**
* @param {number} _this
* @returns {any}
*/
export function vec_first(_this: number): any;
/**
* @param {number} _this
* @param {number} i
* @returns {any}
*/
export function vec_index(_this: number, i: number): any;
/**
* @param {number} _this
* @param {number} i
* @param {any} element
* @returns {number}
*/
export function vec_insert(_this: number, i: number, element: any): number;
/**
* @param {number} _this
* @returns {any}
*/
export function vec_last(_this: number): any;
/**
* @param {number} _this
* @returns {number}
*/
export function vec_len(_this: number): number;
/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function vec_partition_point(_this: number, f: Function): number;
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
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_rchunks(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_rchunks_exact(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_remove(_this: number, index: number): any;
/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function vec_reserve(_this: number, additional: number): number;
/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function vec_reserve_exact(_this: number, additional: number): number;
/**
* @param {number} _this
* @param {number} new_len
* @param {any} val
*/
export function vec_resize(_this: number, new_len: number, val: any): void;
/**
* @param {number} _this
* @param {number} new_len
* @param {Function} f
*/
export function vec_resize_with(_this: number, new_len: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function vec_retain(_this: number, f: Function): void;
/**
* @param {number} _this
*/
export function vec_reverse(_this: number): void;
/**
* @param {number} _this
* @param {number} mid
*/
export function vec_rotate_left(_this: number, mid: number): void;
/**
* @param {number} _this
* @param {number} k
*/
export function vec_rotate_right(_this: number, k: number): void;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_rsplit(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {number}
*/
export function vec_rsplitn(_this: number, n: number, f: Function): number;
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
* @param {number} min_capacity
*/
export function vec_shrink_to(_this: number, min_capacity: number): void;
/**
* @param {number} _this
*/
export function vec_shrink_to_fit(_this: number): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function vec_sort_by(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function vec_sort_unstable_by(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_split(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} mid
* @returns {(Slice)[]}
*/
export function vec_split_at(_this: number, mid: number): (Slice)[];
/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {Slice}
*/
export function vec_splitn(_this: number, n: number, f: Function): Slice;
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
* @param {number} _this
* @param {number} ptr
* @param {number} len
*/
export function vec_swap_with_slice(_this: number, ptr: number, len: number): void;
/**
* @param {number} _this
* @param {number} len
*/
export function vec_truncate(_this: number, len: number): void;
/**
* @param {number} _this
* @param {number} size
* @returns {Slice}
*/
export function vec_windows(_this: number, size: number): Slice;
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
/**
* @returns {number}
*/
export function new_u8_vec(): number;
/**
* @param {number} capacity
* @returns {number}
*/
export function new_u8_vec_with_capacity(capacity: number): number;
/**
* @param {Uint8Array} vec
* @returns {number}
*/
export function u8_vec_from_iter(vec: Uint8Array): number;
/**
* @param {number} _this
* @param {number} other
* @returns {number}
*/
export function u8_vec_append(_this: number, other: number): number;
/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_at(_this: number, index: number): number | undefined;
/**
* @param {number} _this
* @returns {Slice}
*/
export function u8_vec_as_slice(_this: number): Slice;
/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function u8_vec_binary_search_by(_this: number, f: Function): number;
/**
* @param {number} _this
* @returns {number}
*/
export function u8_vec_capacity(_this: number): number;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_chunks_by(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_chunks(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_chunks_exact(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} element
* @returns {boolean}
*/
export function u8_vec_contains(_this: number, element: number): boolean;
/**
* @param {number} _this
*/
export function u8_vec_clear(_this: number): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_dedup(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {number} element
*/
export function u8_vec_fill(_this: number, element: number): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_fill_with(_this: number, f: Function): void;
/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_first(_this: number): number | undefined;
/**
* @param {number} _this
* @param {number} i
* @returns {number}
*/
export function u8_vec_index(_this: number, i: number): number;
/**
* @param {number} _this
* @param {number} i
* @param {number} element
*/
export function u8_vec_insert(_this: number, i: number, element: number): void;
/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_last(_this: number): number | undefined;
/**
* @param {number} _this
* @returns {number}
*/
export function u8_vec_len(_this: number): number;
/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function u8_vec_partition_point(_this: number, f: Function): number;
/**
* @param {number} _this
* @param {number} element
* @returns {number}
*/
export function u8_vec_push(_this: number, element: number): number;
/**
* @param {number} _this
* @param {number} element
* @returns {number}
*/
export function u8_vec_push_front(_this: number, element: number): number;
/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_pop(_this: number): number | undefined;
/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_pop_front(_this: number): number | undefined;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_rchunks(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_rchunks_exact(_this: number, chunk_size: number): Slice;
/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_remove(_this: number, index: number): number | undefined;
/**
* @param {number} _this
* @param {number} additional
*/
export function u8_vec_reserve(_this: number, additional: number): void;
/**
* @param {number} _this
* @param {number} additional
*/
export function u8_vec_reserve_exact(_this: number, additional: number): void;
/**
* @param {number} _this
* @param {number} new_len
* @param {number} val
*/
export function u8_vec_resize(_this: number, new_len: number, val: number): void;
/**
* @param {number} _this
* @param {number} new_len
* @param {Function} f
*/
export function u8_vec_resize_with(_this: number, new_len: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_retain(_this: number, f: Function): void;
/**
* @param {number} _this
*/
export function u8_vec_reverse(_this: number): void;
/**
* @param {number} _this
* @param {number} mid
*/
export function u8_vec_rotate_left(_this: number, mid: number): void;
/**
* @param {number} _this
* @param {number} k
*/
export function u8_vec_rotate_right(_this: number, k: number): void;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_rsplit(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {number}
*/
export function u8_vec_rsplitn(_this: number, n: number, f: Function): number;
/**
* @param {number} _this
* @param {number} index
* @param {number} element
*/
export function u8_vec_set(_this: number, index: number, element: number): void;
/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {Uint8Array} replace_with
* @returns {number}
*/
export function u8_vec_splice_arr(_this: number, start: number, count: number, replace_with: Uint8Array): number;
/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {number} replace_with
* @returns {number}
*/
export function u8_vec_splice_u8_vec(_this: number, start: number, count: number, replace_with: number): number;
/**
* @param {number} _this
* @param {number} at
* @returns {number}
*/
export function u8_vec_split_off(_this: number, at: number): number;
/**
* @param {number} _this
* @param {number} min_capacity
*/
export function u8_vec_shrink_to(_this: number, min_capacity: number): void;
/**
* @param {number} _this
*/
export function u8_vec_shrink_to_fit(_this: number): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_sort_by(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_sort_unstable_by(_this: number, f: Function): void;
/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_split(_this: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} mid
* @returns {(Slice)[]}
*/
export function u8_vec_split_at(_this: number, mid: number): (Slice)[];
/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_splitn(_this: number, n: number, f: Function): Slice;
/**
* @param {number} _this
* @param {number} a
* @param {number} b
*/
export function u8_vec_swap(_this: number, a: number, b: number): void;
/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_swap_remove(_this: number, index: number): number | undefined;
/**
* @param {number} _this
* @param {number} ptr
* @param {number} len
*/
export function u8_vec_swap_with_slice(_this: number, ptr: number, len: number): void;
/**
* @param {number} _this
* @param {number} len
*/
export function u8_vec_truncate(_this: number, len: number): void;
/**
* @param {number} _this
* @param {number} size
* @returns {Slice}
*/
export function u8_vec_windows(_this: number, size: number): Slice;
/**
* @param {number} ptr
*/
export function drop_u8_vec(ptr: number): void;
/**
*/
export class Slice {
  free(): void;
/**
*/
  len: number;
/**
*/
  ptr: number;
}
