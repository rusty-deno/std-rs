
export type Addrs=URL|string;
export type Route=`/${string}`;
export type Hostname=`${number}.${number}.${number}.${number}`;
export type Method="GET"|"HEAD"|"POST"|"PUT"|"DELETE"|"CONNECT"|"OPTIONS"|"TRACE"|"PATCH";


type Res=Response|Promise<Response>;
export type Handler=(...xd: [req: Req,info: Deno.ServeHandlerInfo])=> Res;

export interface Req extends Request {
  params: Record<string,string>;
}
