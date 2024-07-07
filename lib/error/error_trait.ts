// deno-lint-ignore no-unused-vars
import { Option,Some,None } from './option/option.ts';

/**
 * A abstract enum-like type list specifying general categories of error.
 * 
 * Handling errors and matching on {@linkcode ErrorKindLike}
 * 
 * In application code, use match for the {@linkcode ErrorKindLike} values you are expecting.
 * 
 * In comprehensive and thorough tests that want to verify that a test doesn't return any known incorrect error kind,
 * you may want to cut-and-paste the current full list of errors from here into your test code,
 * and then match default as the correct case.
 * This seems counterintuitive, but it will make your tests more robust.
 * In particular, if you want to verify that your code does produce an unrecognized error kind,
 * the robust solution is to check for all the recognized error kinds and fail in those cases.
 */
export type ErrorKindLike=number;

/**
 * Error is a trait representing the basic expectations for error values,
 * i.e., values of type `E` in {@linkcode Result<T, E>}.
 * 
 * Errors must describe themselves through the {@linkcode [Symbol.toStringTag]()} method.
 * Error messages are typically concise lowercase sentences without trailing punctuation
 * 
 * Errors may provide cause information.
 * {@linkcode ErrorTrait.cause} is generally used when errors cross "abstraction boundaries".
 * If one module must report an error that is caused by an error from a lower-level module,
 * it can allow accessing that error via {@linkcode ErrorTraits.cause}.
 * This makes it possible for the high-level module to provide its own errors while also revealing some of the implementation for debugging.
 */
export abstract class ErrorTrait extends Error {
  constructor(protected __kind: ErrorKindLike,error: Error|string,cause?: string) {
    if(typeof error==="string") {
      super(error,{ cause });
      return;
    }

    super();
    this.cause=error.cause;
    this.message=error.message;
    this.name=error.name;
    this.stack=error.stack;
  }

  /**
   * Returns the corresponding {@linkcode ErrorKindLike} for this error.
   * 
   * This may be a value set by code constructing custom Errors, or if this Error was sourced from the operating system,
   * it will be a value inferred from the system's error encoding.
   */
  public abstract kind(): ErrorKindLike;
}





