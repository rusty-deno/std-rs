/* tslint:disable */
/* eslint-disable */
/**
* @param {number} ptr
* @returns {number}
*/
export function spawn_thread(ptr: number): number;
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
*/
export function join_handler(_this: number): void;
/**
* @param {number} _this
* @returns {number}
*/
export function handler_thread(_this: number): number;
/**
* @param {number} _this
* @returns {boolean}
*/
export function task_is_finished(_this: number): boolean;
/**
* @param {number} _this
* @returns {string | undefined}
*/
export function thread_name(_this: number): string | undefined;
/**
* @param {number} _this
* @returns {bigint}
*/
export function thread_id(_this: number): bigint;
/**
* @param {number} _this
*/
export function thread_unpark(_this: number): void;
