import * as _lib from "./std/mod.ts";


class XD {}


const registry=new FinalizationRegistry(()=> {
  console.log("xd");
});

const xd=new XD();
const _xd=[xd];


registry.register(xd,_xd);


console.log(xd);






