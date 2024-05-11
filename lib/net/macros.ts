import { $result,AsyncResult } from "./../error/result/mod.ts";
import { HttpError } from "./error.ts";


/**
 * An improved version of the native {@linkcode fetch} api
 */
export function $fetch(inp: string|URL|Request,init?: RequestInit): AsyncResult<Response,HttpError> {
  return $result(async ()=> {
    const res=await fetch(inp,init);
    if(!res.ok) throw new HttpError(res);
    return res;
  });
}

/**
 * Just a short-cut macro of native {@linkcode URL} constructor
 */
export function $url(uri: string|URL,base?: string|URL): URL {
  return new URL(uri,base);
}
