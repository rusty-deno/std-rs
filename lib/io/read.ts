import { Result,AsyncResult,$result,$resultSync } from '../error/result/mod.ts';
import { Vec } from '../collections/vec/mod.ts';



export abstract class Read {
  public abstract read(buf: Uint8Array): AsyncResult<number,Error>;
  public abstract readSync(buf: Uint8Array): Result<number,Error>;

  //TODO(nate): ignore interrupted Err case.
  public readExact(buf: Uint8Array): AsyncResult<void,Error> {
    return $result(async ()=> {
      while(!buf.length) {
        const n=(await this.read(buf)).result;

        if(typeof n!=="number") throw n;
        if(!n) break;

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new Error("failed to fill whole buffer",{ cause: "ErrorKind.UnexpectedEof" });
      }
    });
  }

  //TODO(nate): ignore interrupted Err case.
  public readExactSync(buf: Uint8Array): Result<void,Error> {
    return $resultSync(()=> {
      while(!buf.length) {
        const n=this.readSync(buf).result;

        if(typeof n!=="number") throw n;
        if(!n) break;

        buf=buf.slice(n);
      }

      if(buf.length) {
        throw new Error("failed to fill whole buffer",{ cause: "ErrorKind.UnexpectedEof" });
      }
    });
  }

  public abstract readToEnd(buf: Uint8Array): AsyncResult<number,Error>;
  public abstract readToEndSymc(buf: Vec<number>): Result<number,Error>;

  public abstract readToString(buf: Vec<number>): AsyncResult<number,Error>;
  public abstract readToStringSync(buf: Vec<number>): Result<number,Error>;
}

