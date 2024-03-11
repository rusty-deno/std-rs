import { Drop } from '../drop.ts';
import { Some,None,Option } from "../../std/mod.ts";
import * as lib from '../../bindings/std_rs.js';
import { Fn } from '../types.ts';
import { $todo } from "../declarative-macros/mod.ts";


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

  public static spawn<T>(f: Fn<[],T>) {
    let retVal=None<T>();
    const fn=Deno.UnsafeCallback.threadSafe({
      parameters: [],
      result: "void"
    },()=> {
      retVal=Some(f());
    });
    
    return $todo();
  }
}




