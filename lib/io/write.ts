import { $result,$resultSync } from "../error/result/mod.ts";
import { IoError,IoErrorKind,IoAsyncResult,IoResult } from "./error.ts";


/**
 * A trait for objects which are byte-oriented sinks.
 * 
 * Implementors of the {@linkcode Write} trait are sometimes called `writers`.
 * 
 * Writers are basically defined by four required methods, {@linkcode write} and {@linkcode flush} and their synchronous varient {@linkcode writeSync} and {@linkcode flushSync}:
 * 
 * The {@linkcode write} method will attempt to write some data into the object,
 * returning how many bytes were successfully written.
 * 
 * The {@linkcode flush} method is useful for adapters and explicit buffers themselves for ensuring that all buffered data has been pushed out to the 'true sink'.
 * 
 * Writers are intended to be composable with one another.
 * Many implementors throughout {@linkcode std.io} take and provide types which implement the {@linkcode Write} trait.
 * 
 * ## Examples
```ts
import { FsFile } from "@std-rs/fs";


const data=$encode("some bytes");
using buf=await FsFile.create("foo.txt").unwrap();

let pos=0;

while(pos<data.length) {
     const bytesWritten=await buf.write(data.slice(pos)).unwrap();
     pos+=bytesWritteen;
}

```
 * The trait also provides convenience methods like {@linkcode writeAll},
 * which calls write in a loop until its entire input has been written.
 */
export abstract class Write {
  /**
   * Write a buffer into this writer, returning how many bytes were written.
   * 
   * This function will attempt to write the entire contents of {@linkcode buf},
   * but the entire write might not succeed, or the write may also generate an error.
   * Typically, a call to write represents one attempt to write to any wrapped object.
   * 
   * Calls to write are not guaranteed to block waiting for data to be written,
   * and a write which would otherwise block can be indicated through an {@linkcode Err} variant.
   * 
   * If this method consumed `n > 0` bytes of {@linkcode buf} it must return `Ok(n)`.
   * If the return value is `Ok(n)` then `n` must satisfy `n <= buf.length`.
   * A return value of `Ok(0)` typically means that the underlying object is no longer able to accept bytes
   * and will likely not be able to in the future as well, or that the buffer provided is empty.
   * 
   * ## Errors
   * * Each call to write may generate an I/O error indicating that the operation could not be completed.
   * * If an error is returned then no bytes in the buffer were written to this writer.
   * It is not considered an error if the entire buffer could not be written to this writer.
   * 
   * * An error of the {@linkcode ErrorKind.Interrupted} kind is non-fatal
   * and the write operation should be retried if there is nothing else to do.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=await FsFile.create("foo.txt").unwrap();
  await buf.write($encode("some bytes")).unwrap();
  ```
   */
  public abstract write(buf: Uint8Array): IoAsyncResult<number>;

  /**
   * Write a buffer into this writer (synchronously), returning how many bytes were written.
   * 
   * This function will attempt to write the entire contents of {@linkcode buf},
   * but the entire write might not succeed, or the write may also generate an error.
   * Typically, a call to write represents one attempt to write to any wrapped object.
   * 
   * Calls to write are not guaranteed to block waiting for data to be written,
   * and a write which would otherwise block can be indicated through an {@linkcode Err} variant.
   * 
   * If this method consumed `n > 0` bytes of {@linkcode buf} it must return `Ok(n)`.
   * If the return value is `Ok(n)` then `n` must satisfy `n <= buf.length`.
   * A return value of `Ok(0)` typically means that the underlying object is no longer able to accept bytes
   * and will likely not be able to in the future as well, or that the buffer provided is empty.
   * 
   * ## Errors
   * * Each call to write may generate an I/O error indicating that the operation could not be completed.
   * * If an error is returned then no bytes in the buffer were written to this writer.
   * It is not considered an error if the entire buffer could not be written to this writer.
   * 
   * * An error of the {@linkcode ErrorKind.Interrupted} kind is non-fatal
   * and the write operation should be retried if there is nothing else to do.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=FsFile.createSync("foo.txt").unwrap();
  buf.writeSync($encode("some bytes")).unwrap();
  ```
   */
  public abstract writeSync(buf: Uint8Array): IoResult<number>;

  /**
   * Flush this output stream, ensuring that all intermediately buffered contents reach their destination.
   * 
   * ## Errors
   * * It is considered an error if not all bytes could be written due to `I/O` errors or `EOF` being reached.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=await FsFile.create("foo.txt").unwrap();

  await buf.write($encode("some bytes")).unwrap();
  await buf.flush().unwrap();
  ```
   */
  public abstract flush(): IoResult<void>;

  /**
   * Flush this output stream (synchronously), ensuring that all intermediately buffered contents reach their destination.
   * 
   * ## Errors
   * * It is considered an error if not all bytes could be written due to `I/O` errors or `EOF` being reached.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=FsFile.createSync("foo.txt").unwrap();

  buf.writeSync($encode("some bytes")).unwrap();
  buf.flushSync().unwrap();
  ```
   */
  public abstract flushSync(): IoResult<void>;

  /**
   * Attempts to write an entire buffer into this writer.
   * 
   * This method will continuously call write until there is no more data to be written
   * or an error of non-{@linkcode ErrorKind.Interrupted} kind is returned.
   * This method will not return until the entire buffer has been successfully written or such an error occurs.
   * The first error that is not of {@linkcode ErrorKind.Interrupted} kind generated from this method will be returned.
   * 
   * If the buffer contains no data, this will never call write.
   * 
   * ## Errors
   * * This function will return the first error of non-{@linkcode ErrorKind.Interrupted} kind that write returns.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=await FsFile.create("foo.txt").unwrap();

  await buf.writeAll($encode("lots of bytes")).unwrap();
  await buf.flush().unwrap();
  ```
   */
  //TODO(nate): Handle interrepted case.
  public writeAll(buf: Uint8Array): IoAsyncResult<void> {
    return $result(async ()=> {
      while(buf.length) {
        const n=(await this.write(buf)).result;

        if(typeof n!=="number") throw n;
        if(!n) throw new IoError(IoErrorKind.WriteZero,"failed to write the whole buffer.");

        buf=buf.slice(n);
      }
    });
  }

  /**
   * Attempts to synchronously write an entire buffer into this writer.
   * 
   * This method will continuously call write until there is no more data to be written
   * or an error of non-{@linkcode ErrorKind.Interrupted} kind is returned.
   * This method will not return until the entire buffer has been successfully written or such an error occurs.
   * The first error that is not of {@linkcode ErrorKind.Interrupted} kind generated from this method will be returned.
   * 
   * If the buffer contains no data, this will never call write.
   * 
   * ## Errors
   * * This function will return the first error of non-{@linkcode ErrorKind.Interrupted} kind that write returns.
   * 
   * ## Example
  ```ts
  import { FsFile } from "@std-rs/fs";

  using buf=await FsFile.create("foo.txt").unwrap();

  await buf.writeAll($encode("lots of bytes")).unwrap();
  await buf.flush().unwrap();
  ```
   */
  //TODO(nate): Handle interrepted case.
  public writeAllSync(buf: Uint8Array): IoResult<void> {
    return $resultSync(()=> {
      while(buf.length) {
        const n=this.writeSync(buf).result;

        if(typeof n!=="number") throw n;
        if(!n) throw new IoError(IoErrorKind.WriteZero,"failed to write the whole buffer.");

        buf=buf.slice(n);
      }
    });
  }
}


