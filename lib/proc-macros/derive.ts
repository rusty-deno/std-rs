import { Class,ClassDecorator,DerivableMacro } from "./types.ts";


/**
 * Attribute decorator used to apply derive macros.
 */
export function derive<C extends Class>(...macros: readonly DerivableMacro<C>[]): ClassDecorator<C> {
  return function(klass: C,context: ClassDecoratorContext) {
    for(const macro of macros) klass=macro(klass,context);

    return klass;
  };
}


