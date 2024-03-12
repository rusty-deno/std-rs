import { MILLIS_PER_SEC,NANOS_PER_MILLI,MICROS_PER_SEC,NANOS_PER_MICRO,NANOS_PER_SEC } from "./mod.ts";


export type DurationValue=number|bigint;


export class Duration {
  /**
   * A duration of zero time.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.ZERO;
   * $assert(duration.isZero());
   * $assertEq!(duration.asNanos(),0);
   * ```
   */
  public static readonly ZERO=new Duration(0,0);

  /**
   * The maximum duration.
   * 
   * May vary by platform as necessary.
   * Must be able to contain the difference between two instances of {@linkcode Instant} or two instances of {@linkcode SystemTime}.
   * This constraint gives it a value of about 584,942,417,355 years in practice, which is currently used on all platforms.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(Duration.MAX,new Duration(0xFFFFFFFFFFFFFFFFn,1_000_000_000 - 1));
   * ```
   */
  public static readonly MAX=new Duration(0xFFFFFFFFFFFFFFFFn,9999999999);

  /**
   * The duration of one second.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(Duration.SECOND,Duration.fromSecs(1));
   * ```
   */
  public static readonly SECOND=new Duration(1);

  /**
   * The duration of one millisecond.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(Duration.MILLISECOND,Duration.millis(1));
   * ```
   */
  public static readonly MILLISECOND=new Duration(0,1_000_000);

  /**
   * The duration of one microsecond.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(Duration.MICROSECOND,Duration.fromMicros(1));
   * ```
   */
  public static readonly MICROSECOND=new Duration(0,1000);

  /**
   * The duration of one nanosecond.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(Duration.NANOSECOND,Duration.fromNanos(1));
   * ```
   */
  public static readonly NANOSECOND=new Duration(0,1);
  
  ////////////////
  // Properties //
  ////////////////

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

  /////////////
  // Methods //
  /////////////

  /**
   * Returns true if this {@linkcode Duration} spans no time.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * 
   * $assert(Duration.ZERO.isZero());
   * $assert(new Duration(0n, 0).isZero());
   * $assert(Duration.fromNanos(0).isZero());
   * $assert(Duration.fromSecs(0).isZero());
   * 
   * $assert(!Duration.new(1n, 1).isZero());
   * $assert(!Duration.fromNanos(1).isZero());
   * $assert(!Duration.fromSecs(1).isZero());
   * ```
   */
  public isZero() {
    return this.secs===0n && this.nanos===0;
  }

  /**
   * Returns the number of whole seconds contained by this {@linkcode Duration}.
   * 
   * The returned value does not include the fractional (nanosecond) part of the duration, which can be obtained using {@linkcode subsecNanos}.
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5n, 730023852);
   * assertEq(duration.asSecs(), 5n);
   * ```
   * To determine the total number of seconds represented by the {@linkcode Duration} including the fractional part, use {@linkcode asSecsNumber}.
   */
  public asSecs() {
    return this.secs;
  }


}


function calc(duration: DurationValue,format: bigint,nanoCount: number) {
  const dur=BigInt(duration);
  return new Duration(dur/format,Number(dur%format)*nanoCount);
}





