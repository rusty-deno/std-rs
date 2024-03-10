// deno-lint-ignore-file


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
* @returns {JoinHandle}
*/
export function spawn_thread(ptr) {
    const ret = wasm.spawn_thread(ptr);
    return JoinHandle.__wrap(ret);
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
*/
export function drop_thread(_this) {
    wasm.drop_thread(_this);
}

const JoinHandleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_joinhandle_free(ptr >>> 0));
/**
*/
export class JoinHandle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JoinHandle.prototype);
        obj.__wbg_ptr = ptr;
        JoinHandleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JoinHandleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_joinhandle_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    is_finished() {
        const ret = wasm.joinhandle_is_finished(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    thread() {
        const ret = wasm.joinhandle_thread(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    */
    join() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_joinhandle_free(ptr);
    }
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

