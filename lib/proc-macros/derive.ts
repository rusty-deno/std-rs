import { Class,ClassDecorator,DerivableMacro } from "./types.ts";


/**
 * Attribute decorator used to apply derive macros.
 */
export function derive(...macros: readonly DerivableMacro[]): ClassDecorator {
  return function<C extends Class>(klass: C,context: ClassDecoratorContext) {
    for(const macro of macros) klass=macro(klass,context);

    return klass;
  };
}


