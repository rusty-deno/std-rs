import { $unimplemented } from "../declarative-macros/mod.ts";
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

  #secs: bigint;
  #nanos: number;

  /**
   * Creates a new Duration from the specified number of whole seconds and additional nanoseconds.
   * 
   * If the number of nanoseconds is greater than 1 billion (the number of nanoseconds in a second), then it will carry over into the seconds provided.
   * 
   * ### Example
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const fiveSeconds = new Duration(5,0);
   * ```
   */
  constructor(secs: DurationValue,nanos=0) {
    this.#secs=BigInt(secs);
    this.#nanos=nanos;
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
   * $assertEq(2n, duration.asSecs());
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
   * const duration = Duration.fromNanos(1_000_000_123);
   * 
   * $assertEq(1n, duration.asSecs());
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
   * $assert(new Duration(0, 0).isZero());
   * $assert(Duration.fromNanos(0).isZero());
   * $assert(Duration.fromSecs(0).isZero());
   * 
   * $assert(!Duration.new(1n, 1).isZero());
   * $assert(!Duration.fromNanos(1).isZero());
   * $assert(!Duration.fromSecs(1).isZero());
   * ```
   */
  public isZero() {
    return this.#secs===0n && this.#nanos===0;
  }
  
  /**
   * Returns the number of whole seconds contained by this {@linkcode Duration}.
   * 
   * The returned value does not include the fractional (nanosecond) part of the duration, which can be obtained using {@linkcode subsecNanos}.
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5, 730023852);
   * assertEq(duration.secs, 5n);
   * ```
   * To determine the total number of seconds represented by the {@linkcode Duration} including the fractional part, use {@linkcode asSecsNumber}.
   */
  public get secs() {
    return this.#secs;
  }

  /**
   * Returns the fractional part of this {@linkcode Duration}, in nanoseconds.
   * 
   * This method does not return the length of the duration when represented by nanoseconds. The returned number always represents a fractional portion of a second (i.e., it is less than one billion).
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.fromMillis(5010);
   * $assertEq(duration.asSecs(), 5);
   * $assertEq(duration.nanos, 10_000_000);
   * ```
   */
  public get nanos() {
    return this.#nanos;
  }

  /**
   * Returns the number of whole seconds as number contained by this {@linkcode Duration}.
   * 
   * The returned value does not include the fractional (nanosecond) part of the duration, which can be obtained using {@linkcode subsecNanos}.
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5, 730023852);
   * assertEq(duration.asSecs(), 5);
   * ```
   * To determine the total number of seconds represented by the {@linkcode Duration} including the fractional part, use {@linkcode asSecsNumber}.
   * 
   * ### Unstable
   * Output of this function may not be always correct if the contained value is too big to be represented as a number.
   * 
   * use {@linkcode secs} for better control over the program.
   */
  public asSecs() {
    return Number(this.#secs);
  }

  /**
   * Returns the fractional part of this {@linkcode Duration}, in whole milliseconds.
   * This method does not return the length of the duration when represented by milliseconds. The returned number always represents a fractional portion of a second (i.e., it is less than one thousand).
   * 
   * ## Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.from_millis(5432);
   * $assertEq(duration.asSecs(), 5);
   * $assertEq(duration.subsecMillis(), 432);
   * ```
   */
  public subsecMillis() {
    return this.#nanos/NANOS_PER_MILLI;
  }

  /**
   * Returns the fractional part of this {@linkcode Duration}, in whole microseconds.
   * 
   * This method does not return the length of the duration when represented by microseconds. The returned number always represents a fractional portion of a second (i.e., it is less than one million).
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = Duration.fromMicros(1_234_567);
   * $assertEq(duration.asSecs(), 1);
   * $assertEq(duration.subsecMicros(), 234_567);
   * ```
   */
  public subsecMicros() {
    return this.#nanos/NANOS_PER_MICRO;
  }

  /**
   * Returns the total number of whole milliseconds contained by this {@linkcode Duration}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5, 730023852);
   * $assertEq(duration.asMillis(), 5730);
   * ```
   * ### Unstable
   * Output of this function may not be very accurate as there is no type in javascript that can represent `u128` (128 bit long unsigned integer)
   */
  public asMillis() {
    return this.#secs*MILLIS_PER_SEC + BigInt(this.#nanos/NANOS_PER_MILLI);
  }

  /**
   * Returns the total number of whole microseconds contained by this {@linkcode Duration}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5, 730023852);
   * $assertEq(duration.asMicros(), 5730);
   * ```
   * ### Unstable
   * Output of this function may not be very accurate as there is no type in javascript that can represent `u128` (128 bit long unsigned integer)
   */
  public asMicros() {
    return this.#secs*MICROS_PER_SEC + BigInt(this.#nanos/NANOS_PER_MICRO);
  }

  /**
   * Returns the total number of whole nanoseconds contained by this {@linkcode Duration}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const duration = new Duration(5, 730023852);
   * $assertEq(duration.asNanos(), 5730);
   * ```
   * ### Unstable
   * Output of this function may not be very accurate as there is no type in javascript that can represent `u128` (128 bit long unsigned integer)
   */
  public asNanos() {
    return this.#secs*BigInt(NANOS_PER_SEC) + BigInt(this.#nanos);
  }

  public absDiff() {
    return $unimplemented();
  }

  /**
   * {@linkcode Duration} addition. Computes `this` + {@linkcode rhs}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(new Duration(100).add(new Duration(69)),new Duration(169));
   * ```
   */
  public add(rhs: Duration) {
    let secs=this.#secs+rhs.#secs;
    let nanos=this.#nanos+rhs.#nanos;

    if(nanos>=NANOS_PER_SEC) {
      nanos-=NANOS_PER_SEC;
      secs+=1n;
    }

    return new Duration(secs,nanos);
  }


  /**
   * {@linkcode Duration} addition. Computes `this.secs` + {@linkcode secs} and `this.nanos` + {@linkcode nanos}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * $assertEq(new Duration(100).addValue(69,69),new Duration(169,69));
   * ```
   */
  public addValue(secs: DurationValue,nanos: number=0) {
    return new Duration(BigInt(secs)+this.#secs,this.#nanos+nanos);
  }

  /**
   * {@linkcode Duration} addition. Computes `this` += {@linkcode rhs}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const dur = new Duration(100);
   * 
   * dur.addAssign(new Duration(69));
   * $assertEq(new Duration(100),new Duration(169));
   * ```
   */
  public addAssign(rhs: Duration) {
    this.#secs+=rhs.#secs;
    this.#nanos+=rhs.#nanos;

    if(this.#nanos<NANOS_PER_SEC) return;

    this.#nanos-=NANOS_PER_SEC;
    this.#secs+=1n;
  }

  /**
   * {@linkcode Duration} addition. Computes `this.secs` += {@linkcode secs} and `this.nanos` += {@linkcode nanos}.
   * 
   * ### Examples
   * ```ts
   * import { Duration } from "@std/time";
   * 
   * const dur = new Duration(100);
   * 
   * dur.addAssignValue(69,69);
   * $assertEq(dur,new Duration(169,69));
   * ```
   */
  public addAssignValue(secs: DurationValue,nanos: number=0) {
    this.#secs+=BigInt(secs);
    this.#nanos+=nanos;
  }
}


function calc(duration: DurationValue,format: bigint,nanoCount: number) {
  const dur=BigInt(duration);
  return new Duration(dur/format,Number(dur%format)*nanoCount);
}





