
import { Vec } from '../collections/vec/mod.ts';
import { IoAsyncResult,IoResult,IoErrorKind,IoError } from "./error.ts";
import { $result,$resultSync } from '../error/result/mod.ts';



export abstract class Read {
  public abstract read(buf: Uint8Array): IoAsyncResult<number>;
  public abstract readSync(buf: Uint8Array): IoResult<number>;

  //TODO(nate): ignore interrupted Err case.
  public readExact(buf: Uint8Array): IoAsyncResult<void> {
    return $result(async ()=> {
      while(!buf.length) {
        const n=(await this.read(buf)).result;

        if(typeof n!=="number") throw n;
        if(!n) break;

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new IoError(IoErrorKind.UnexpectedEof,"failed to write the whole buffer.");
      }
    });
  }

  //TODO(nate): ignore interrupted Err case.
  public readExactSync(buf: Uint8Array): IoResult<void> {
    return $resultSync(()=> {
      while(!buf.length) {
        const n=this.readSync(buf).result;

        if(typeof n!=="number") throw n;
        if(!n) break;

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new IoError(IoErrorKind.UnexpectedEof,"failed to write the whole buffer.");
      }
    });
  }

  public abstract readToEnd(buf: Uint8Array): IoAsyncResult<number>;
  public abstract readToEndSymc(buf: Vec<number>): IoResult<number>;

  public abstract readToString(buf: Vec<number>): IoAsyncResult<number>;
  public abstract readToStringSync(buf: Vec<number>): IoResult<number>;
}

