
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

export abstract class ErrorTrait extends Error {
  #kind: ErrorKindLike;
  constructor(kind: ErrorKindLike,error: Error|string,cause?: string) {
    if(typeof error==="string") {
      super(error,{ cause });
      this.#kind=kind;
      return;
    }

    super();
    this.#kind=kind;
    this.cause=error.cause;
    this.message=error.message;
    this.name=error.name;
    this.stack=error.stack;
  }

  public abstract kind(): ErrorKindLike;
  public abstract rawOsError(): number;
}





