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

  public unpark() {
    lib.thread_unpark(this.___ptr);
  }

  public static spawn<T>(f: Fn<[],T>) {
    let retVal=None<T>();
    const fn=Deno.UnsafeCallback.threadSafe({
      parameters: [],
      result: "void"
    },()=> retVal=Some(f()));

    return JoinHandleBuilder.new(
      lib.spawn_thread(
        Number(Deno.UnsafePointer.value(fn.pointer))
      ),
      retVal
    );
  }

  public static current() {
    return new Thread(lib.current_thread());
  }

  public static panicking() {
    return lib.thread_panicking();
  }

  public static park() {
    lib.park_thread();
  }

  public static parkWithTimeout(dur: number|bigint) {
    lib.park_thread_with_timeout(BigInt(dur));
  }

  public static sleep(dur: number|bigint) {
    lib.sleep(BigInt(dur));
  }

  public static yieldNow() {
    lib.yield_now();
  }
}

// TODO: seal the class
export class JoinHandle<T> extends Drop {
  protected constructor(private ___ptr: number,private ___return: Option<T>) {
    super();
  }

  protected drop(): void {
    lib.drop_join_handle(this.___ptr);
  }

  public isFinished() {
    return lib.is_finished(this.___ptr);
  }

  public thread() {
    return ThreadHandleBuilder.new(lib.thread(this.___ptr));
  }

  public join() {
    return result.$resultSync(()=> {
      lib.join(this.___ptr);
      return this.___return.value as T;
    });
  }
}

class JoinHandleBuilder<_> extends JoinHandle<_> {
  public static new<T>(ptr: number,_return: Option<T>) {
    return new JoinHandle<T>(ptr,_return);
  }
}

class ThreadHandleBuilder extends Thread {
  public static new(ptr: number) {
    return new Thread(ptr);
  }
}







