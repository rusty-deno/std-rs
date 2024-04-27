

const globalRegistry=new Map<number,FinalizationRegistry<void>>();


abstract class Drop {
  constructor() {
    const id=globalRegistry.size;
    const dropRef=new WeakRef(this.drop);

    const registry=new FinalizationRegistry(()=> {
      globalRegistry.delete(id);
      dropRef.deref()!();
    });

    registry.register(this,undefined);
    globalRegistry.set(id,registry);
  }

  protected abstract drop(): void;
}

class XD extends Drop {
  protected drop(): void {
    console.log("XD was dropped");
  }
}

for(let i=0;i<100000;i++) {
  const xd=new XD();
  console.log(xd);
}



