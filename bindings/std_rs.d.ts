/* tslint:disable */
/* eslint-disable */
/**
* @param {number} ptr
* @returns {JoinHandle}
*/
export function spawn_thread(ptr: number): JoinHandle;
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
/**
* @param {number} _this
*/
export function drop_thread(_this: number): void;
/**
*/
export class JoinHandle {
  free(): void;
/**
* @returns {boolean}
*/
  is_finished(): boolean;
/**
* @returns {number}
*/
  thread(): number;
/**
*/
  join(): void;
}
