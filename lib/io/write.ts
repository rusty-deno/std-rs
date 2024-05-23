import { Result,AsyncResult,$result,$resultSync } from "../error/result/mod.ts";



export abstract class Write {
  public abstract write(buf: Uint8Array): AsyncResult<number,Error>;
  public abstract writeSync(buf: Uint8Array): Result<number,Error>;
  public abstract flush(): Result<void,Error>;
  public abstract flushSync(): Result<void,Error>;

  //TODO(nate): Handle interrepted case.
  public writeAll(buf: Uint8Array): AsyncResult<void,Error> {
    return $result(async ()=> {
      while(buf.length) {
        const n=(await this.write(buf)).result;

        if(typeof n!=="number") throw n;
        if(!n) throw new Error("failed to write the whole buffer.",{ cause: "ErrorKind.WriteZero" });

        buf=buf.slice(n);
      }
    });
  }

  //TODO(nate): Handle interrepted case.
  public writeAllSync(buf: Uint8Array): Result<void,Error> {
    return $resultSync(()=> {
      while(buf.length) {
        const n=this.writeSync(buf).result;

        if(typeof n!=="number") throw n;
        if(!n) throw new Error("failed to write the whole buffer.",{ cause: "ErrorKind.WriteZero" });

        buf=buf.slice(n);
      }
    });
  }
}


