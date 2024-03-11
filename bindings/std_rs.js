

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
/**
* @param {number} ptr
* @returns {number}
*/
export function spawn_thread(ptr) {
    const ret = wasm.spawn_thread(ptr);
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
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
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

