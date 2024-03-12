import { MILLIS_PER_SEC,NANOS_PER_MILLI,MICROS_PER_SEC,NANOS_PER_MICRO,NANOS_PER_SEC } from "./mod.ts";


export type DurationValue=number|bigint;


export class Duration {
  private secs: bigint;

  /**
   * Creates a new Duration from the specified number of whole seconds and additional nanoseconds.
   * 
   * If the number of nanoseconds is greater than 1 billion (the number of nanoseconds in a second), then it will carry over into the seconds provided.
   * 
   * ### Panics
   * This constructor will panic if the carry from the nanoseconds overflows the seconds counter.
   * 
   * ### Example
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const fiveSeconds = new Duration(5,0);
   * ```
   */
  constructor(secs: DurationValue,private nanos=0) {
    this.secs=BigInt(secs);
  }

  /**
   * Creates a new Duration from the specified number of whole seconds.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.fromSecs(5);
   * 
   * $assertEq(5, duration.asSecs());
   * $assertEq(0, duration.subsecNanos());
   * ```
   */
  public static fromSecs(secs: DurationValue) {
    return new Duration(secs,0);
  }

  /**
   * Creates a new Duration from the specified number of milliseconds.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.fromMillis(2569);
   * 
   * $assertEq(2, duration.asSecs());
   * $assertEq(569_000_000, duration.subsecNanos());
   * ```
   */
  public static fromMillis(millis: DurationValue) {
    return calc(millis,MILLIS_PER_SEC,NANOS_PER_MILLI);
  }
  
  /**
   * Creates a new Duration from the specified number of microseconds.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.fromMillis(2569);
   * 
   * $assertEq(1, duration.asSecs());
   * $assertEq(2000, duration.subsecNanos());
   * ```
   */
  public static fromMicros(micros: DurationValue) {
    return calc(micros,MICROS_PER_SEC,NANOS_PER_MICRO);
  }

  /**
   * Creates a new Duration from the specified number of nanoseconds.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.from_nanos(1_000_000_123);
   * 
   * $assertEq(1, duration.asSecs());
   * $assertEq(123, duration.subsecNanos());
   * ```
   */
  public static fromNanos(nanos: DurationValue) {
    const _nanos=BigInt(nanos);
    const _NANOS_PER_SEC=BigInt(NANOS_PER_SEC);
    return new Duration(_nanos/_NANOS_PER_SEC,Number(_nanos%_NANOS_PER_SEC));
  }




}


function calc(duration: DurationValue,format: bigint,nanoCount: number) {
  const dur=BigInt(duration);
  return new Duration(dur/format,Number(dur%format)*nanoCount);
}




