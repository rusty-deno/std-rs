
const globalRegistry=new Map<number,FinalizationRegistry<DropOptions>>();

interface DropOptions {
  id: number;
  destructor: WeakRef<VoidFunction>
}


export abstract class Drop {
  constructor() {
    const id=globalRegistry.size;
    const destructor=new WeakRef(this.drop);

    const registry=new FinalizationRegistry(drop);
    registry.register(this,{ id,destructor });

    globalRegistry.set(id,registry);
  }

  protected abstract drop(): void;
}

function drop({ id,destructor }: DropOptions) {
  globalRegistry.delete(id);
  destructor.deref()!();
}

