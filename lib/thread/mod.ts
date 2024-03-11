import { Thread,JoinHandle } from "./thread.ts";
import { $resultSync } from "../error/result/macros.ts";
import * as lib from '../../bindings/std_rs.js';



////////////////////////////////////////////////////////////////////////////////
// Free functions
////////////////////////////////////////////////////////////////////////////////

/**
 * Spawns a new thread, and returns a {@linkcode JoinHandle} for it.
 * 
 * The join handle provides a join method that can be used to join the spawned thread. If the spawned thread panics, join will return an `Err`.
 * 
 * If the join handle is dropped, the spawned thread will implicitly be detached. In this case, the spawned thread may no longer be joined. (It is the responsibility of the program to either eventually join threads it creates or detach them; otherwise, a resource leak will result.)
 * 
 * ## Panics
 * Panics if the OS fails to create a thread
 * 
 * ## Examples
 * Creating a thread.
 * ```
 * import thread from "@std/thread";
 * 
 * const handler = thread.spawn(()=> {
 *   // thread code here
 * });
 * 
 * handler.join().unwrap();
 * ```
 * As mentioned in the module documentation, threads are usually made to communicate using channels, here is how it usually looks.
 */
// return type is mentioned only to keep symlinks used in the docs without having the lint yelling...
export function spawn<T>(f: ()=> T,name?: string): JoinHandle<T> {
  return Thread.spawn(f,name);
}

/**
 * Returns an estimate of the default amount of parallelism a program should use.
 * 
 * Parallelism is a resource. A given machine provides a certain capacity for parallelism, i.e., a bound on the number of computations it can perform simultaneously. This number often corresponds to the amount of CPUs a computer has, but it may diverge in various cases.
 * 
 * Host environments such as VMs or container orchestrators may want to restrict the amount of parallelism made available to programs in them. This is often done to limit the potential impact of (unintentionally) resource-intensive programs on other programs running on the same machine.
 * 
 * ### Limitations
 * The purpose of this API is to provide an easy and portable way to query the default amount of parallelism the program should use. Among other things it does not expose information on NUMA regions, does not account for differences in (co)processor capabilities or current system load, and will not modify the program's global state in order to more accurately query the amount of available parallelism.
 * 
 * Where both fixed steady-state and burst limits are available the steady-state capacity will be used to ensure more predictable latencies.
 * 
 * Resource limits can be changed during the runtime of a program, therefore the value is not cached and instead recomputed every time this function is called. It should not be called from hot code.
 * 
 * The value returned by this function should be considered a simplified approximation of the actual amount of parallelism available at any given time. To get a more detailed or precise overview of the amount of parallelism available to the program, you may wish to use platform-specific APIs as well. The following platform limitations currently apply to available_parallelism:
 * 
 * ### On Windows:
 * 
 * * It may undercount the amount of parallelism available on systems with more than 64 logical CPUs. However, programs typically need specific support to take advantage of more than 64 logical CPUs, and in the absence of such support, the number returned by this function accurately reflects the number of logical CPUs the program can use by default.
 * * It may overcount the amount of parallelism available on systems limited by process-wide affinity masks, or job object limitations.
 * ### On Linux:
 * 
 * * It may overcount the amount of parallelism available when limited by a process-wide affinity mask or cgroup quotas and sched_getaffinity() or cgroup fs can't be queried, e.g. due to sandboxing.
 * * It may undercount the amount of parallelism if the current thread's affinity mask does not reflect the process' cpuset, e.g. due to pinned threads.
 * * If the process is in a cgroup v1 cpu controller, this may need to scan mountpoints to find the corresponding cgroup v1 controller, which may take time on systems with large numbers of mountpoints. (This does not apply to cgroup v2, or to processes not in a cgroup.)
 * ### On all targets:
 * 
 * * It may overcount the amount of parallelism available when running in a VM with CPU usage limits (e.g. an overcommitted host).
 * 
 * ### Errors
 * This function will, but is not limited to, return errors in the following cases:
 * 
 * * If the amount of parallelism is not known for the target platform.
 * * If the program lacks permission to query the amount of parallelism made available to it.
 * 
 * ### Examples
 * ```ts
 * import thread from "@std/thread";
 * 
 * $assert(availableParallelism >= 1_usize);
 * ```
 */
export function availableParallelism() {
  return $resultSync(lib.available_parallelism);
}

/**
 * Gets a handle to the thread that invokes it.
 * 
 * ### Examples
 * Getting a handle to the current thread with {@linkcode current}:
 * ```ts
 * import thread from "@std/thread";
 * 
 * const handler = thread.spawn(()=> {
 *   console.log(thread.current().id);
 * }).unwrap();
 * 
 * handler.join().unwrap();
 * ```
 */
export function current() {
  return Thread.current();
}

/**
 * Determines whether the current thread is unwinding because of panic.
 * 
 * This can be used in multithreaded applications, in order to send a message to other threads warning that a thread has panicked (e.g., for monitoring purposes).
 */
export function panicking() {
  return lib.thread_panicking();
}

/**
 * Blocks unless or until the current thread's token is made available.
 * 
 * A call to {@linkcode Thread.park} does not guarantee that the thread will remain parked forever, and callers should be prepared for this possibility. However, it is guaranteed that this function will not panic (it may abort the process if the implementation encounters some rare errors).
 * 
 * {@linkcode Thread.park} and {@linkcode Thread.unpark}
 * 
 * Every thread is equipped with some basic low-level blocking support, via the {@linkcode unpark} method. park blocks the current thread, which can then be resumed from another thread by calling the `unpark` method on the blocked thread's handle.
 * 
 * Conceptually, each Thread handle has an associated token, which is initially not present:
 * 
 * The {@linkcode Thread.park} function blocks the current thread unless or until the token is available for its thread handle, at which point it atomically consumes the token. It may also return spuriously, without consuming the token. {@linkcode Thread.parkWithTimeout} does the same, but allows specifying a maximum time to block the thread for.
 * 
 * The {@linkcode unpark} method on a Thread atomically makes the token available if it wasn't already. Because the token is initially absent, `unpark` followed by park will result in the second call returning immediately.
 * 
 * The API is typically used by acquiring a handle to the current thread, placing that handle in a shared data structure so that other threads can find it, and then parking in a loop. When some desired condition is met, another thread calls {@linkcode unpark} on the handle.
 */
export function park() {
  lib.park_thread();
}

/**
 * Blocks unless or until the current thread's token is made available or the specified duration has been reached (may wake spuriously).
 * 
 * The semantics of this function are equivalent to park except that the thread will be blocked for roughly no longer than dur. This method should not be used for precise timing due to anomalies such as preemption or platform differences that might not cause the maximum amount of time waited to be precisely dur long.
 * 
 * See the park documentation for more details.
 * 
 * ### Platform-specific behavior
 * Platforms which do not support nanosecond precision for sleeping will have dur rounded up to the nearest granularity of time they can sleep for.
 */
export function parkWithTimeout(dur: number|bigint) {
  lib.park_thread_with_timeout(BigInt(dur));
}

/**
 * Puts the current thread to sleep for at least the specified amount of time.
 * 
 * The thread may sleep longer than the duration specified due to scheduling specifics or platform-dependent functionality. It will never sleep less.
 * 
 * ### Note:
 * * This function is blocking, and should not be used in async functions.
 * 
 * ### Examples
 * ```ts
 * import thread from "@std/thread";
 * 
 * thread.sleep(69000);// The thread sleeps for atleast 69 seconds never less. (It maybe sightly longer, about a few nanos)
 */
export function sleep(dur: number|bigint) {
  lib.sleep(BigInt(dur));
}

/**
 * Cooperatively gives up a timeslice to the OS scheduler.
 * 
 * In short it just gives up running and lets the scheduler run the next thread.
 */
export function yieldNow() {
  lib.yield_now();
}


export * from "./thread.ts";