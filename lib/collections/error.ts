import { ErrorTrait } from "../error/error_trait.ts";
import { Enum } from '../types.ts';


export type CollectionErrorKind=Enum<typeof CollectionErrorKind>;
/**
 * A list specifying general categories of Collection error.
 * 
 * This list is intended to grow over time and it is not recommended to exhaustively match against it.
 * 
 * It is used with the {@linkcode CollectionError} type.
 * 
 * Handling errors and matching on {@linkcode CollectionErrorKind}
 * In application code, use match for the {@linkcode CollectionErrorKind} values you are expecting;
 * use `default` to match "all other errors".
 */
export const CollectionErrorKind={
  /** Index went out of bounds */
  IndexOutOfBounds: 1,
  /** Maximum capacity overflowed */
  CapacityOverflow: 2
} as const;

/**  */
export type CollectionErrorKindStr=
|"index out of bounds"
|"exceeded max capacity";




/**
 * The error type for all collections,
 */
export class CollectionError extends ErrorTrait {
  constructor(kind: CollectionErrorKind,error: string|Error,cause?: string) {
    super(kind,error,cause);
  }

  /**
   * Returns the corresponding {@linkcode CollectionErrorKind} for this error.
   * 
   * This may be a value set by Rust code constructing custom {@linkcode CollectionError}s,
   * or if this {@linkcode CollectionError} was sourced from the operating system,
   * it will be a value inferred from the system's error encoding.
   */
  public kind(): CollectionErrorKind {
    return this.__kind as CollectionErrorKind;
  }
}



