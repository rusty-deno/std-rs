import { Err } from "../../std/mod.ts";

/** The {@linkcode HttpError} type that represents all HTTP Error types.*/
export class HttpError<E extends (Err|Response)=Response> extends Error {
  err?: Err;
  res?: Response;

  constructor(res?: E) {
    super();
    if(res instanceof Response) this.res=res;
    else this.err=res;
  }

}

