import { Server,GET } from "./std/net.ts";


class XD extends Server {
  @GET("/xd")
  private xd() {
    return new Response("xd");
  }
}


function main() {
  try {
    const server=new XD();
    server.listen();
  } catch {
    const port=6969;

    const server=new Server();
    server.get("/",()=> new Response("Hello, World\n",{ status: 200 }));

    server.listen({ port });
  }
}


if(import.meta.main) main();



