import { $result,$resultSync } from "../error/result/mod.ts";
import { $option,$optionSync } from "../error/option/mod.ts";

export class FsFile {
  constructor(private inner: Deno.FsFile) {};
  
  public static create(path: string) {
    return $result(async ()=> new FsFile(await Deno.create(path)));
  }
  
  public static createSync(path: string) {
    return $resultSync(()=> new FsFile(Deno.createSync(path)));
  }
  
  public static open(path: string,options?: Deno.OpenOptions) {
    return $result(async ()=> new FsFile(await Deno.open(path,options)));
  }
  
  public static openSync(path: string,options?: Deno.OpenOptions) {
    return $resultSync(()=> new FsFile(Deno.openSync(path,options)));
  }

  public get readable() {
    return this.inner.readable;
  }

  public get writable() {
    return this.inner.writable;
  }

  /**
   * Attempts to sync all OS-internal metadata to disk.
   * 
   * This function will attempt to ensure that all in-memory data reaches the filesystem before returning.
   * 
   * This can be used to handle errors that would otherwise only be caught when the File is closed.
   * 
   * Dropping a file will ignore errors in synchronizing this in-memory data.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  const encoder = new TextEncoder();
  using file = await FsFile.create("foo.txt").unwrap();
  
  await file.writeAll(encoder.encode("Hello, world!")).unwrap();
  await f.syncAll().unwrap();
  ```
   * * **UNSTABLE**: New API, yet to be vetted.
   */
  public syncAll() {
    return $result(()=> this.inner.sync());
  }

  /**
   * Attempts to sync all OS-internal metadata to disk synchronously.
   * 
   * This function will attempt to ensure that all in-memory data reaches the filesystem before returning.
   * 
   * This can be used to handle errors that would otherwise only be caught when the File is closed.
   * 
   * Dropping a file will ignore errors in synchronizing this in-memory data.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  const encoder = new TextEncoder();
  using file = FsFile.createSync("foo.txt").unwrap();
  
  file.writeAllSync(encoder.encode("Hello, world!")).unwrap();
  f.syncAllSync().unwrap();
  ```
   * * **UNSTABLE**: New API, yet to be vetted.
   */
  public syncAllSync() {
    return $resultSync(()=> this.inner.syncSync());
  }

  /**
   * This function is similar to {@linkcode syncAll}, except that it might not synchronize file metadata to the filesystem.
   * 
   * This is intended for use cases that must synchronize content, but don't need the metadata on disk. The goal of this method is to reduce disk operations.
   * 
   * Note that some platforms may simply implement this in terms of {@linkcode syncAll}.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  using file = await FsFile.create("foo.txt").unwrap();
  
  await file.writeAll(b"Hello, world!").unwrap();
  await file.syncData().unwrap();
  ```
   * * **UNSTABLE**: New API, yet to be vetted.
   */
  public syncData() {
    return $result(()=> this.inner.syncData());
  }

  /**
   * This function is similar to {@linkcode syncAllSync}, except that it might not synchronize file metadata to the filesystem.
   * 
   * This is intended for use cases that must synchronize content, but don't need the metadata on disk. The goal of this method is to reduce disk operations.
   * 
   * Note that some platforms may simply implement this in terms of {@linkcode syncAll}.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  using file = FsFile.createSync("foo.txt").unwrap();
  
  file.writeAllSync(b"Hello, world!").unwrap();
  file.syncDataSync().unwrap();
  ```
   * * **UNSTABLE**: New API, yet to be vetted.
   */
  public syncDataSync() {
    return $resultSync(()=> this.inner.syncDataSync());
  }

  /**
   * Truncates or extends the underlying file, updating the size of this file to become size.
   * 
   * If the size is less than the current file's size, then the file will be shrunk.
   * If it is greater than the current file's size, then the file will be extended to size and have all of the intermediate data filled in with 0s.
   * 
   * The file's cursor isn't changed.
   * In particular, if the cursor was at the end and the file is shrunk using this operation, the cursor will now be past the end.
   * 
   * ### Errors
   * This function will return an error if the file is not opened for writing. Also, std::io::ErrorKind::InvalidInput will be returned if the desired length would cause an overflow due to the implementation specifics.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  using file = await FsFile.create("foo.txt")?;
  await file.setLen(10)?;
  ```
   * Note that this method alters the content of the underlying file.
   */
  public setLen(len: number) {
    return $result(()=> this.inner.truncate(len));
  }

  /**
   * Synchronously truncates or extends the underlying file, updating the size of this file to become size.
   * 
   * If the size is less than the current file's size, then the file will be shrunk.
   * If it is greater than the current file's size, then the file will be extended to size and have all of the intermediate data filled in with 0s.
   * 
   * The file's cursor isn't changed.
   * In particular, if the cursor was at the end and the file is shrunk using this operation, the cursor will now be past the end.
   * 
   * ### Errors
   * This function will return an error if the file is not opened for writing. Also, std::io::ErrorKind::InvalidInput will be returned if the desired length would cause an overflow due to the implementation specifics.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";
  
  using file = FsFile.createSync("foo.txt")?;
  file.setLenSync(10)?;
  ```
   * Note that this method alters the content of the underlying file.
   */
  public setLenSync(len: number) {
    return $resultSync(()=> this.inner.truncateSync(len));
  }

  /**
   * Queries metadata about the underlying file.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";

  const file = await FsFile.open("foo.txt")?;
  const metadata = await file.metadata()?;
  ```
   */
  public metadata() {
    return $result(async ()=>  await this.inner.stat());
  }

  /**
   * Synchronously queries metadata about the underlying file.
   * 
   * ### Examples
  ```ts
  import { FsFile } from "@std/fs";

  const file = FsFile.openSync("foo.txt")?;
  const metadata = file.metadataSync()?;
  ```
   */
  public metadataSync() {
    return $resultSync(()=> this.inner.statSync());
  }



  public async read() {
    return await $option(async ()=> {
      const buf=new Uint8Array;
      const bytes=await this.inner.read(buf);
      return bytes==null?bytes:buf;
    });
  }

  public readSync() {
    return $optionSync(()=> {
      const buf=new Uint8Array;
      const bytes=this.inner.readSync(buf);
      return bytes==null?bytes:buf;
    });
  }

  public write(buf: Uint8Array) {
    return $result(()=> this.inner.write(buf));
  }

  public writeSync(buf: Uint8Array) {
    return $resultSync(()=> this.inner.writeSync(buf));
  }

  public seek(offset: number|bigint,whench: Deno.SeekMode) {
    return this.inner.seek(offset,whench);
  }



}


