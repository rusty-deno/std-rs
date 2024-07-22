
import { Uint8Vec } from './typed_arrays/uint8vec.ts';
import { $result,$resultSync } from '../error/result/mod.ts';
import { IoAsyncResult,IoResult,IoErrorKind,IoError } from "./error.ts";


const PROBE_SIZE=32;

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
    return $result(async ()=> {
      let startLen=buf.length;
      let startCap=buf.capacity;
      let initialized=0;
      
      if(buf.capacity-buf.length < PROBE_SIZE) {
        const read=(await smallProbeRead(this,buf)).result;

        if(read===0) {
          return 0;
        }
      }







      return 0;
    });
  }

  // public readToEndSync(buf: Uint8Vec): IoResult<number>;

  // public readToString(): IoAsyncResult<string>;
  // public readToStringSync(): IoResult<string>;
}

function smallProbeRead<R extends Read>(r: R,buf: Uint8Vec): IoAsyncResult<number> {
  return $result(async ()=> {
    const probe=Uint8Vec.withCapacity(PROBE_SIZE);

    while(true) {
      const n=(await r.read(probe.view())).result;
  
      if(typeof n==="number") {
        buf.extend(probe);
        return n;
      }
      if(n.kind()===IoErrorKind.Interrupted) continue;

      throw n;
    }
  });
}

