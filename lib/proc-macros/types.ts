// deno-lint-ignore-file

export interface AsyncPropertyDescriptor<T> extends PropertyDescriptor {
  value?: (...args: unknown[])=> Promise<T>;
  get?: ()=> Promise<T>;
  set?: (value: Promise<T>)=> void;
}

export type Class={
  new(...args: any[]): Object
};


export interface DerivableMacro {
  <C extends Class>(constructor: C): C;
}


