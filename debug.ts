

const nums=new Array(0x7fffffff);
const buf=new Uint8Array(nums.length);
const file=await Deno.open("./temp/cargo.lock.copy",{ read: true,write: true });


for(let i=0;i<nums.length;i++) {
  buf[i]=i;
}

// console.log(await file.write(buf),0x7fffffff);
// console.log(buf);









file.close();
