/**
* @param {number} ptr
* @returns {number}
*/
export function spawn_thread(ptr) {
    const ret = wasm.spawn_thread(ptr);
    return ret >>> 0;
}

/**
* @param {number} _this
*/
export function join_handler(_this) {
    wasm.join_handler(_this);
}

/**
* @param {number} _this
*/
export function handler_thread(_this) {
    wasm.handler_thread(_this);
}

/**
* @param {number} _this
* @returns {boolean}
*/
export function task_is_finished(_this) {
    const ret = wasm.task_is_finished(_this);
    return ret !== 0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
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

const imports = {
    __wbindgen_placeholder__: {
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

