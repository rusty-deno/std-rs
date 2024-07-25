
import * as lib from "../../bindings/std_rs.js";
import { Uint8Vec } from './typed_arrays/uint8vec.ts';
import { $result,$resultSync } from '../error/result/mod.ts';
import { IoAsyncResult,IoResult,IoErrorKind,IoError } from "./error.ts";



export abstract class Read {
  public abstract read(buf: Uint8Array): IoAsyncResult<number>;
  public abstract readSync(buf: Uint8Array): IoResult<number>;

  public readExact(buf: Uint8Array): IoAsyncResult<void> {
    return $result(async ()=> {
      while(!buf.length) {
        const n=(await this.read(buf)).result;

        if(!n) break;
        if(typeof n!=="number") {
          if(n.kind()===IoErrorKind.Interrupted) continue;
          throw n;
        }
        new Uint8Array().slice;

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new IoError(IoErrorKind.UnexpectedEof,"failed to write the whole buffer.");
      }
    });
  }

  public readExactSync(buf: Uint8Array): IoResult<void> {
    return $resultSync(()=> {
      while(!buf.length) {
        const n=this.readSync(buf).result;

        if(!n) break;
        if(typeof n!=="number") {
          if(n.kind()===IoErrorKind.Interrupted) continue;
          throw n;
        }

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new IoError(IoErrorKind.UnexpectedEof,"failed to write the whole buffer.");
      }
    });
  }

  public readToEnd(buf: Uint8Vec): IoAsyncResult<number> {
    return $result(lib.read_to_end,buf.thisPtr(),this,this.read);
  }

  public readToEndSync(buf: Uint8Vec): IoResult<number> {
    return $resultSync(lib.read_to_end_sync,buf.thisPtr(),this,this.readSync);
  }

  // public readToString(): IoAsyncResult<string>;
  // public readToStringSync(): IoResult<string>;
}
