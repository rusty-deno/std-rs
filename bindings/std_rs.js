

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
* @returns {number}
*/
export function new_vec() {
    const ret = wasm.new_vec();
    return ret >>> 0;
}

/**
* @param {number} capacity
* @returns {number}
*/
export function new_vec_with_capacity(capacity) {
    const ret = wasm.new_vec_with_capacity(capacity);
    return ret >>> 0;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* @param {any[]} vec
* @returns {number}
*/
export function vec_from_iter(vec) {
    const ptr0 = passArrayJsValueToWasm0(vec, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vec_from_iter(ptr0, len0);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} other
* @returns {number}
*/
export function vec_append(_this, other) {
    const ret = wasm.vec_append(_this, other);
    return ret;
}

/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_at(_this, index) {
    const ret = wasm.vec_at(_this, index);
    return takeObject(ret);
}

/**
* @param {number} _this
* @returns {Slice}
*/
export function vec_as_slice(_this) {
    const ret = wasm.u8_vec_as_slice(_this);
    return Slice.__wrap(ret);
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function vec_binary_search_by(_this, f) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vec_binary_search_by(retptr, _this, addHeapObject(f));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} _this
* @returns {number}
*/
export function vec_capacity(_this) {
    const ret = wasm.u8_vec_capacity(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_chunks_by(_this, f) {
    const ret = wasm.vec_chunks_by(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_chunks(_this, chunk_size) {
    const ret = wasm.vec_chunks(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_chunks_exact(_this, chunk_size) {
    const ret = wasm.vec_chunks_exact(_this, chunk_size);
    return Slice.__wrap(ret);
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {number} _this
* @param {any} element
* @returns {boolean}
*/
export function vec_contains(_this, element) {
    try {
        const ret = wasm.vec_contains(_this, addBorrowedObject(element));
        return ret !== 0;
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {number} _this
*/
export function vec_clear(_this) {
    wasm.vec_clear(_this);
}

/**
* @param {number} _this
* @param {Function} f
*/
export function vec_dedup(_this, f) {
    wasm.vec_dedup(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {any} element
*/
export function vec_fill(_this, element) {
    wasm.vec_fill(_this, addHeapObject(element));
}

/**
* @param {number} _this
* @param {Function} f
*/
export function vec_fill_with(_this, f) {
    wasm.vec_fill_with(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @returns {any}
*/
export function vec_first(_this) {
    const ret = wasm.vec_first(_this);
    return takeObject(ret);
}

/**
* @param {number} _this
* @param {number} i
* @returns {any}
*/
export function vec_index(_this, i) {
    const ret = wasm.vec_index(_this, i);
    return takeObject(ret);
}

/**
* @param {number} _this
* @param {number} i
* @param {any} element
* @returns {number}
*/
export function vec_insert(_this, i, element) {
    const ret = wasm.vec_insert(_this, i, addHeapObject(element));
    return ret;
}

/**
* @param {number} _this
* @returns {any}
*/
export function vec_last(_this) {
    const ret = wasm.vec_last(_this);
    return takeObject(ret);
}

/**
* @param {number} _this
* @returns {number}
*/
export function vec_len(_this) {
    const ret = wasm.u8_vec_len(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function vec_partition_point(_this, f) {
    const ret = wasm.vec_partition_point(_this, addHeapObject(f));
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {any} element
* @returns {number}
*/
export function vec_push(_this, element) {
    const ret = wasm.vec_push(_this, addHeapObject(element));
    return ret;
}

/**
* @param {number} _this
* @param {any} element
* @returns {number}
*/
export function vec_push_front(_this, element) {
    const ret = wasm.vec_push_front(_this, addHeapObject(element));
    return ret;
}

/**
* @param {number} _this
* @returns {any}
*/
export function vec_pop(_this) {
    const ret = wasm.vec_pop(_this);
    return takeObject(ret);
}

/**
* @param {number} _this
* @returns {any}
*/
export function vec_pop_front(_this) {
    const ret = wasm.vec_pop_front(_this);
    return takeObject(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_rchunks(_this, chunk_size) {
    const ret = wasm.vec_rchunks(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function vec_rchunks_exact(_this, chunk_size) {
    const ret = wasm.vec_rchunks_exact(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_remove(_this, index) {
    const ret = wasm.vec_remove(_this, index);
    return takeObject(ret);
}

/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function vec_reserve(_this, additional) {
    const ret = wasm.vec_reserve(_this, additional);
    return ret;
}

/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function vec_reserve_exact(_this, additional) {
    const ret = wasm.vec_reserve_exact(_this, additional);
    return ret;
}

/**
* @param {number} _this
* @param {number} new_len
* @param {any} val
*/
export function vec_resize(_this, new_len, val) {
    wasm.vec_resize(_this, new_len, addHeapObject(val));
}

/**
* @param {number} _this
* @param {number} new_len
* @param {Function} f
*/
export function vec_resize_with(_this, new_len, f) {
    wasm.vec_resize_with(_this, new_len, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
*/
export function vec_retain(_this, f) {
    wasm.vec_retain(_this, addHeapObject(f));
}

/**
* @param {number} _this
*/
export function vec_reverse(_this) {
    wasm.vec_reverse(_this);
}

/**
* @param {number} _this
* @param {number} mid
*/
export function vec_rotate_left(_this, mid) {
    wasm.vec_rotate_left(_this, mid);
}

/**
* @param {number} _this
* @param {number} k
*/
export function vec_rotate_right(_this, k) {
    wasm.vec_rotate_right(_this, k);
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_rsplit(_this, f) {
    const ret = wasm.vec_rsplit(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {number}
*/
export function vec_rsplitn(_this, n, f) {
    const ret = wasm.vec_rsplitn(_this, n, addHeapObject(f));
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} index
* @param {any} element
* @returns {number}
*/
export function vec_set(_this, index, element) {
    const ret = wasm.vec_set(_this, index, addHeapObject(element));
    return ret;
}

/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {any[]} replace_with
* @returns {number}
*/
export function vec_splice_arr(_this, start, count, replace_with) {
    const ptr0 = passArrayJsValueToWasm0(replace_with, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vec_splice_arr(_this, start, count, ptr0, len0);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {number} replace_with
* @returns {number}
*/
export function vec_splice_vec(_this, start, count, replace_with) {
    const ret = wasm.vec_splice_vec(_this, start, count, replace_with);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} at
* @returns {number}
*/
export function vec_split_off(_this, at) {
    const ret = wasm.vec_split_off(_this, at);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} min_capacity
*/
export function vec_shrink_to(_this, min_capacity) {
    wasm.vec_shrink_to(_this, min_capacity);
}

/**
* @param {number} _this
*/
export function vec_shrink_to_fit(_this) {
    wasm.vec_shrink_to_fit(_this);
}

/**
* @param {number} _this
* @param {Function} f
*/
export function vec_sort_by(_this, f) {
    wasm.vec_sort_by(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
*/
export function vec_sort_unstable_by(_this, f) {
    wasm.vec_sort_unstable_by(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function vec_split(_this, f) {
    const ret = wasm.vec_split(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
* @param {number} _this
* @param {number} mid
* @returns {(Slice)[]}
*/
export function vec_split_at(_this, mid) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.vec_split_at(retptr, _this, mid);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {Slice}
*/
export function vec_splitn(_this, n, f) {
    const ret = wasm.vec_splitn(_this, n, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function vec_swap(_this, a, b) {
    const ret = wasm.vec_swap(_this, a, b);
    return ret;
}

/**
* @param {number} _this
* @param {number} index
* @returns {any}
*/
export function vec_swap_remove(_this, index) {
    const ret = wasm.vec_swap_remove(_this, index);
    return takeObject(ret);
}

/**
* @param {number} _this
* @param {number} ptr
* @param {number} len
*/
export function vec_swap_with_slice(_this, ptr, len) {
    wasm.vec_swap_with_slice(_this, ptr, len);
}

/**
* @param {number} _this
* @param {number} len
*/
export function vec_truncate(_this, len) {
    wasm.vec_truncate(_this, len);
}

/**
* @param {number} _this
* @param {number} size
* @returns {Slice}
*/
export function vec_windows(_this, size) {
    const ret = wasm.vec_windows(_this, size);
    return Slice.__wrap(ret);
}

/**
* @param {number} ptr
*/
export function drop_vec(ptr) {
    wasm.drop_vec(ptr);
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
* @param {number} ptr
* @param {string | undefined} [name]
* @returns {number}
*/
export function spawn_thread(ptr, name) {
    var ptr0 = isLikeNone(name) ? 0 : passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    const ret = wasm.spawn_thread(ptr, ptr0, len0);
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function available_parallelism() {
    const ret = wasm.available_parallelism();
    return ret >>> 0;
}

/**
* @returns {number}
*/
export function current_thread() {
    const ret = wasm.current_thread();
    return ret >>> 0;
}

/**
* @returns {boolean}
*/
export function thread_panicking() {
    const ret = wasm.thread_panicking();
    return ret !== 0;
}

/**
*/
export function park_thread() {
    wasm.park_thread();
}

/**
* @param {bigint} dur
*/
export function park_thread_with_timeout(dur) {
    wasm.park_thread_with_timeout(dur);
}

/**
* @param {bigint} dur
*/
export function sleep(dur) {
    wasm.sleep(dur);
}

/**
*/
export function yield_now() {
    wasm.yield_now();
}

/**
* @param {number} _this
* @returns {boolean}
*/
export function is_finished(_this) {
    const ret = wasm.is_finished(_this);
    return ret !== 0;
}

/**
* @param {number} _this
* @returns {number}
*/
export function thread(_this) {
    const ret = wasm.thread(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
*/
export function join(_this) {
    wasm.join(_this);
}

/**
* @param {number} _this
* @returns {bigint}
*/
export function thread_id(_this) {
    const ret = wasm.thread_id(_this);
    return BigInt.asUintN(64, ret);
}

/**
* @param {number} _this
*/
export function thread_unpark(_this) {
    wasm.thread_unpark(_this);
}

/**
* @param {number} _this
* @returns {string | undefined}
*/
export function thread_name(_this) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.thread_name(retptr, _this);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v1;
        if (r0 !== 0) {
            v1 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
        }
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} this_ptr
*/
export function drop_thread(this_ptr) {
    wasm.drop_thread(this_ptr);
}

/**
* @param {number} this_ptr
*/
export function drop_join_handle(this_ptr) {
    wasm.drop_join_handle(this_ptr);
}

/**
* @returns {number}
*/
export function new_u8_vec() {
    const ret = wasm.new_u8_vec();
    return ret >>> 0;
}

/**
* @param {number} capacity
* @returns {number}
*/
export function new_u8_vec_with_capacity(capacity) {
    const ret = wasm.new_u8_vec_with_capacity(capacity);
    return ret >>> 0;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} vec
* @returns {number}
*/
export function u8_vec_from_iter(vec) {
    const ptr0 = passArray8ToWasm0(vec, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.u8_vec_from_iter(ptr0, len0);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} other
* @returns {number}
*/
export function u8_vec_append(_this, other) {
    const ret = wasm.u8_vec_append(_this, other);
    return ret;
}

/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_at(_this, index) {
    const ret = wasm.u8_vec_at(_this, index);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @returns {Slice}
*/
export function u8_vec_as_slice(_this) {
    const ret = wasm.u8_vec_as_slice(_this);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function u8_vec_binary_search_by(_this, f) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.u8_vec_binary_search_by(retptr, _this, addHeapObject(f));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} _this
* @returns {number}
*/
export function u8_vec_capacity(_this) {
    const ret = wasm.u8_vec_capacity(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_chunks_by(_this, f) {
    const ret = wasm.u8_vec_chunks_by(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_chunks(_this, chunk_size) {
    const ret = wasm.u8_vec_chunks(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_chunks_exact(_this, chunk_size) {
    const ret = wasm.u8_vec_chunks_exact(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} element
* @returns {boolean}
*/
export function u8_vec_contains(_this, element) {
    const ret = wasm.u8_vec_contains(_this, element);
    return ret !== 0;
}

/**
* @param {number} _this
*/
export function u8_vec_clear(_this) {
    wasm.u8_vec_clear(_this);
}

/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_dedup(_this, f) {
    wasm.u8_vec_dedup(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {number} element
*/
export function u8_vec_fill(_this, element) {
    wasm.u8_vec_fill(_this, element);
}

/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_fill_with(_this, f) {
    wasm.u8_vec_fill_with(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_first(_this) {
    const ret = wasm.u8_vec_first(_this);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @param {number} i
* @returns {number | undefined}
*/
export function u8_vec_index(_this, i) {
    const ret = wasm.u8_vec_index(_this, i);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @param {number} i
* @param {number} element
* @returns {number}
*/
export function u8_vec_insert(_this, i, element) {
    const ret = wasm.u8_vec_insert(_this, i, element);
    return ret;
}

/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_last(_this) {
    const ret = wasm.u8_vec_last(_this);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @returns {number}
*/
export function u8_vec_len(_this) {
    const ret = wasm.u8_vec_len(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {Function} f
* @returns {number}
*/
export function u8_vec_partition_point(_this, f) {
    const ret = wasm.u8_vec_partition_point(_this, addHeapObject(f));
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} element
* @returns {number}
*/
export function u8_vec_push(_this, element) {
    const ret = wasm.u8_vec_push(_this, element);
    return ret;
}

/**
* @param {number} _this
* @param {number} element
* @returns {number}
*/
export function u8_vec_push_front(_this, element) {
    const ret = wasm.u8_vec_push_front(_this, element);
    return ret;
}

/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_pop(_this) {
    const ret = wasm.u8_vec_pop(_this);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @returns {number | undefined}
*/
export function u8_vec_pop_front(_this) {
    const ret = wasm.u8_vec_pop_front(_this);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_rchunks(_this, chunk_size) {
    const ret = wasm.u8_vec_rchunks(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} chunk_size
* @returns {Slice}
*/
export function u8_vec_rchunks_exact(_this, chunk_size) {
    const ret = wasm.u8_vec_rchunks_exact(_this, chunk_size);
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_remove(_this, index) {
    const ret = wasm.u8_vec_remove(_this, index);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function u8_vec_reserve(_this, additional) {
    const ret = wasm.u8_vec_reserve(_this, additional);
    return ret;
}

/**
* @param {number} _this
* @param {number} additional
* @returns {number}
*/
export function u8_vec_reserve_exact(_this, additional) {
    const ret = wasm.u8_vec_reserve_exact(_this, additional);
    return ret;
}

/**
* @param {number} _this
* @param {number} new_len
* @param {number} val
*/
export function u8_vec_resize(_this, new_len, val) {
    wasm.u8_vec_resize(_this, new_len, val);
}

/**
* @param {number} _this
* @param {number} new_len
* @param {Function} f
*/
export function u8_vec_resize_with(_this, new_len, f) {
    wasm.u8_vec_resize_with(_this, new_len, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_retain(_this, f) {
    wasm.u8_vec_retain(_this, addHeapObject(f));
}

/**
* @param {number} _this
*/
export function u8_vec_reverse(_this) {
    wasm.u8_vec_reverse(_this);
}

/**
* @param {number} _this
* @param {number} mid
*/
export function u8_vec_rotate_left(_this, mid) {
    wasm.u8_vec_rotate_left(_this, mid);
}

/**
* @param {number} _this
* @param {number} k
*/
export function u8_vec_rotate_right(_this, k) {
    wasm.u8_vec_rotate_right(_this, k);
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_rsplit(_this, f) {
    const ret = wasm.u8_vec_rsplit(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {number}
*/
export function u8_vec_rsplitn(_this, n, f) {
    const ret = wasm.u8_vec_rsplitn(_this, n, addHeapObject(f));
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} index
* @param {number} element
* @returns {number}
*/
export function u8_vec_set(_this, index, element) {
    const ret = wasm.u8_vec_set(_this, index, element);
    return ret;
}

/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {Uint8Array} replace_with
* @returns {number}
*/
export function u8_vec_splice_arr(_this, start, count, replace_with) {
    const ptr0 = passArray8ToWasm0(replace_with, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.u8_vec_splice_arr(_this, start, count, ptr0, len0);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} start
* @param {number} count
* @param {number} replace_with
* @returns {number}
*/
export function u8_vec_splice_u8_vec(_this, start, count, replace_with) {
    const ret = wasm.u8_vec_splice_u8_vec(_this, start, count, replace_with);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} at
* @returns {number}
*/
export function u8_vec_split_off(_this, at) {
    const ret = wasm.u8_vec_split_off(_this, at);
    return ret >>> 0;
}

/**
* @param {number} _this
* @param {number} min_capacity
*/
export function u8_vec_shrink_to(_this, min_capacity) {
    wasm.u8_vec_shrink_to(_this, min_capacity);
}

/**
* @param {number} _this
*/
export function u8_vec_shrink_to_fit(_this) {
    wasm.u8_vec_shrink_to_fit(_this);
}

/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_sort_by(_this, f) {
    wasm.u8_vec_sort_by(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
*/
export function u8_vec_sort_unstable_by(_this, f) {
    wasm.u8_vec_sort_unstable_by(_this, addHeapObject(f));
}

/**
* @param {number} _this
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_split(_this, f) {
    const ret = wasm.u8_vec_split(_this, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} mid
* @returns {(Slice)[]}
*/
export function u8_vec_split_at(_this, mid) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.u8_vec_split_at(retptr, _this, mid);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4, 4);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {number} _this
* @param {number} n
* @param {Function} f
* @returns {Slice}
*/
export function u8_vec_splitn(_this, n, f) {
    const ret = wasm.u8_vec_splitn(_this, n, addHeapObject(f));
    return Slice.__wrap(ret);
}

/**
* @param {number} _this
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function u8_vec_swap(_this, a, b) {
    const ret = wasm.u8_vec_swap(_this, a, b);
    return ret;
}

/**
* @param {number} _this
* @param {number} index
* @returns {number | undefined}
*/
export function u8_vec_swap_remove(_this, index) {
    const ret = wasm.u8_vec_swap_remove(_this, index);
    return ret === 0xFFFFFF ? undefined : ret;
}

/**
* @param {number} _this
* @param {number} ptr
* @param {number} len
*/
export function u8_vec_swap_with_slice(_this, ptr, len) {
    wasm.u8_vec_swap_with_slice(_this, ptr, len);
}

/**
* @param {number} _this
* @param {number} len
*/
export function u8_vec_truncate(_this, len) {
    wasm.u8_vec_truncate(_this, len);
}

/**
* @param {number} _this
* @param {number} size
* @returns {Slice}
*/
export function u8_vec_windows(_this, size) {
    const ret = wasm.u8_vec_windows(_this, size);
    return Slice.__wrap(ret);
}

/**
* @param {number} ptr
*/
export function drop_u8_vec(ptr) {
    wasm.drop_u8_vec(ptr);
}

const SliceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_slice_free(ptr >>> 0));
/**
*/
export class Slice {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Slice.prototype);
        obj.__wbg_ptr = ptr;
        SliceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SliceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_slice_free(ptr);
    }
    /**
    * @returns {number}
    */
    get ptr() {
        const ret = wasm.__wbg_get_slice_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set ptr(arg0) {
        wasm.__wbg_set_slice_ptr(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get len() {
        const ret = wasm.__wbg_get_slice_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set len(arg0) {
        wasm.__wbg_set_slice_len(this.__wbg_ptr, arg0);
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbg_call_27c0f87801dedf93: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_call_b3ca7c6051f9bec1: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_call_8e7cb608789c2528: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2), getObject(arg3));
            return addHeapObject(ret);
        }, arguments) },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_as_number: function(arg0) {
            const ret = +getObject(arg0);
            return ret;
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbindgen_number_new: function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_is_falsy: function(arg0) {
            const ret = !getObject(arg0);
            return ret;
        },
        __wbindgen_jsval_eq: function(arg0, arg1) {
            const ret = getObject(arg0) === getObject(arg1);
            return ret;
        },
        __wbg_slice_new: function(arg0) {
            const ret = Slice.__wrap(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_rethrow: function(arg0) {
            throw takeObject(arg0);
        },
    },

};

const wasm_url = new URL('std_rs_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;

