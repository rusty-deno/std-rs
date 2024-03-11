import { Fn } from '../types.ts';
import { Drop } from '../drop.ts';
import * as lib from '../../bindings/std_rs.js';
import { Some,None,Option,result } from "../../std/mod.ts";



// TODO: seal the class/**
/**
 * A handle to a thread.
 * Threads are represented via the {@linkcode Thread} type, which you can get in one of two ways:
 * 
 * * By spawning a new thread, e.g., using the {@linkcode Thread.spawn} function, and calling the {@linkcode JoinHandle.thread} on the {@linkcode JoinHandle}.
 * * By requesting the current thread, using the {@linkcode Thread.current} function.
 * 
 * The {@linkcode Thread.current} function is available even for threads not spawned by the APIs of this module.
 * 
 * There is usually no need to create a {@linkcode Thread} object yourself, one should instead use a function like {@linkcode Thread.spawn} to create new threads, see the docs of Builder and spawn for more details.
 */
export class Thread extends Drop {
  public readonly id: bigint;
  public readonly name: Option<string>;

  protected constructor(private ___ptr: number) {
    super();
    this.id=lib.thread_id(___ptr);
    this.name=new Option(lib.thread_name(___ptr));
  }

  protected drop(): void {
    lib.drop_thread(this.___ptr);
  }

  /**
   * Atomically makes the handle's token available if it is not already.
   * 
   * Every thread is equipped with some basic low-level blocking support, via the {@linkcode Thread.park} function and the {@linkcode unpark} method. These can be used as a more CPU-efficient implementation of a spinlock.
   * 
   * See the park documentation for more details.
   */
  public unpark() {
    lib.thread_unpark(this.___ptr);
  }

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
   * import { Thread } from "@std/thread";
   * 
   * const handler = Thread.spawn(()=> {
   *   // thread code here
   * });
   * 
   * handler.join().unwrap();
   * ```
   * As mentioned in the module documentation, threads are usually made to communicate using channels, here is how it usually looks.
   */
  public static spawn<T>(f: Fn<[],T>,name?: string) {
    return JoinHandleBuilder.new(f,name);
  }

  /**
   * Gets a handle to the thread that invokes it.
   * 
   * ### Examples
   * Getting a handle to the current thread with {@linkcode Thread.current}:
   * ```ts
   * import { Thread } from "@std/thread";
   * 
   * const handler = Thread.spawn(()=> {
   *   console.log(Thread.current().id);
   * }).unwrap();
   * 
   * handler.join().unwrap();
   * ```
   */
  public static current() {
    return new Thread(lib.current_thread());
  }

  /**
   * Determines whether the current thread is unwinding because of panic.
   * 
   * This can be used in multithreaded applications, in order to send a message to other threads warning that a thread has panicked (e.g., for monitoring purposes).
   */
  public static panicking() {
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
  public static park() {
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
  public static parkWithTimeout(dur: number|bigint) {
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
   * import { Thread } from "@std/thread";
   * 
   * Thread.sleep(69000);// The thread sleeps for atleast 69 seconds never less. (It maybe sightly longer, about a few nanos)
   */
  public static sleep(dur: number|bigint) {
    lib.sleep(BigInt(dur));
  }

  /**
   * Cooperatively gives up a timeslice to the OS scheduler.
   * 
   * In short it just gives up running and lets the scheduler run the next thread.
   */
  public static yieldNow() {
    lib.yield_now();
  }
}


// TODO: seal the class
/**
 * An owned permission to join on a thread (block on its termination).
 * 
 * A JoinHandle detaches the associated thread when it is dropped, which means that there is no longer any handle to the thread and no way to join on it.
 * 
 * Due to platform restrictions, it is not possible to Clone this handle: the ability to join a thread is a uniquely-owned permission.
 * * Trying to copy a handle may lead to memory corruption.
 * 
 * This object is created by the {@linkcode Thread.spawn} function.
 */
export class JoinHandle<T> extends Drop {
  #return=None<T>();
  #ptr: number;
  #fn;// im too lazy to provide that huge type def here...xd

  protected constructor(f: Fn<[],T>,private name?: string) {
    super();
    this.#fn=Deno.UnsafeCallback.threadSafe({
      parameters: [],
      result: "void"
    },()=> this.#return=Some(f()));

    this.#ptr=lib.spawn_thread(
      Number(Deno.UnsafePointer.value(this.#fn.pointer)),
      name
    );
  }

  protected drop(): void {
    lib.drop_join_handle(this.#ptr);
    this.#fn.close();
  }

  /**
   * Checks if the associated thread has finished running its main function.
   * 
   * {@linkcode isFinished} supports implementing a non-blocking join operation, by checking {@linkcode isFinished}, and calling join if it returns true. This function does not block. To block while waiting on the thread to finish, use join.
   * 
   * This might return true for a brief moment after the thread's main function has returned, but before the thread itself has stopped running. However, once this returns true, join can be expected to return quickly, without blocking for any significant amount of time.
   */
  public isFinished() {
    return lib.is_finished(this.#ptr);
  }

  /**
   * Extracts a handle to the underlying thread.
   * 
   * ### Examples
   * ```ts
   * import { Thread } from "@std/thread";
   * 
   * const handle=Thread.spawn(()=> {
   *   // some work here
   * }).unwrap();
   * 
   * const thread = handle.thread();
   * 
   * console.log(`thread id: ${thread.id()}`);
   * ```
   */
  public thread() {
    return ThreadHandleBuilder.new(lib.thread(this.#ptr));
  }

  /**
   * Waits for the associated thread to finish.
   * 
   * This function will return immediately if the associated thread has already finished.
   * 
   * If the associated thread panics, `Err` is returned.
   * 
   * ### Panics
   * This function may panic on some platforms if a thread attempts to join itself or otherwise may create a deadlock with joining threads.
   * 
   * ### Examples
   * ```ts
   * import { Thread } from "@std/thread";
   * 
   * const handle=Thread.spawn(()=> {
   *   // some work here
   * }).unwrap();
   * 
   * handle.join().expect("Couldn't join on the associated thread");
   * ```
   */
  public join() {
    return result.$resultSync(()=> {
      lib.join(this.#ptr);
      return this.#return.value as T;
    });
  }
}

class JoinHandleBuilder<_> extends JoinHandle<_> {
  public static new<T>(f: Fn<[],T>,name?: string) {
    return new JoinHandle<T>(f,name);
  }
}

class ThreadHandleBuilder extends Thread {
  public static new(ptr: number) {
    return new Thread(ptr);
  }
}







