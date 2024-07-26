
import * as lib from "../../bindings/std_rs.js";
import { Uint8Vec } from './typed_arrays/uint8vec.ts';
import { $result,$resultSync } from '../error/result/mod.ts';
import { IoAsyncResult,IoResult } from "./error.ts";



export abstract class Read {
  public abstract read(buf: Uint8Array): IoAsyncResult<number>;
  public abstract readSync(buf: Uint8Array): IoResult<number>;
  #read=(buf: Uint8Array): Promise<number>=> this.read(buf).unwrapOrThrow();
  #readSync=(buf: Uint8Array): number=> this.readSync(buf).unwrapOrThrow();


  public readExact(buf: Uint8Array): IoAsyncResult<void> {
    const ptr=Deno.UnsafePointer.value(Deno.UnsafePointer.of(buf));
    return $result(lib.read_exact,this,this.#read,Number(ptr),buf.length);
  }

  public readExactSync(buf: Uint8Array): IoResult<void> {
    return $resultSync(lib.read_exact_sync,this,this.#readSync,buf);
  }

  public readToEnd(buf: Uint8Vec): IoAsyncResult<number> {
    return $result(lib.read_to_end,buf.thisPtr(),this,this.#read);
  }

  public readToEndSync(buf: Uint8Vec): IoResult<number> {
    return $resultSync(lib.read_to_end_sync,buf.thisPtr(),this,this.#readSync);
  }

  public readToString(): IoAsyncResult<string> {
    return $result(lib.read_to_string,this,this.#read);
  }

  public readToStringSync(): IoResult<string> {
    return $resultSync(lib.read_to_string_sync,this,this.#readSync);
  }
}
