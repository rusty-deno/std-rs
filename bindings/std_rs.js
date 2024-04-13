

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

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

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
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
* @param {number} index
* @returns {any}
*/
export function vec_at(_this, index) {
    const ret = wasm.vec_at(_this, index);
    return takeObject(ret);
}

/**
* @param {number} _this
* @returns {number}
*/
export function vec_len(_this) {
    const ret = wasm.vec_len(_this);
    return ret >>> 0;
}

/**
* @param {number} _this
* @returns {number}
*/
export function vec_capacity(_this) {
    const ret = wasm.vec_capacity(_this);
    return ret >>> 0;
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
export function vec_splice(_this, start, count, replace_with) {
    const ptr0 = passArrayJsValueToWasm0(replace_with, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vec_splice(_this, start, count, ptr0, len0);
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
* @param {number} other
* @returns {number}
*/
export function vec_append(_this, other) {
    const ret = wasm.vec_append(_this, other);
    return ret;
}

/**
* @param {number} _this
*/
export function vec_clear(_this) {
    wasm.vec_clear(_this);
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
* @param {number} index
* @returns {any}
*/
export function vec_remove(_this, index) {
    const ret = wasm.vec_remove(_this, index);
    return takeObject(ret);
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

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
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

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_rethrow: function(arg0) {
            throw takeObject(arg0);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_number_new: function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
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

