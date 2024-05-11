// deno-lint-ignore-file ban-types no-explicit-any
import { Fn } from '../types.ts';


export interface Class {
  new(...args: any[]): Object;
}

export interface ClassDecorator<C extends Class> {
  (constructor: C,context: ClassDecoratorContext): C;
}

export interface ClassMethodDecorator<P extends any[],R> {
  (fn: Fn<P,R>,context: ClassMethodDecoratorContext): Fn<P,R>|void;
}



export type DerivableMacro<C extends Class>=ClassDecorator<C>;
