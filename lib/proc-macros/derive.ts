import { Class, DerivableMacro } from "./types.ts";



export function derive(...macros: readonly DerivableMacro[]) {
  return function<C extends Class>(klass: C) {
    for(const macro of macros) klass=macro(klass);

    return klass;
  };
}


