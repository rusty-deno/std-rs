import { $result,$resultSync } from '../error/result/mod.ts';
import { PathBuf } from '../path.ts';
import { FsFile } from './file.ts';

export * from "./directory_builder.ts";
export * from "./file.ts";



/**
 * Returns the canonical, absolute form of a path with all intermediate components normalized and symbolic links resolved.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * path does not exist.
 * * A non-final component in path is not a directory.
 * * `allow-read` permission for {@linkcode path} is not provided.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * console.log(`absolute path: ${await fs.canonicalize(`./69420/").unwrap()}`);
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function canonicalize(path: PathBuf) {
  return $result(()=> Deno.realPath(path));
}

/**
 * Returns the canonical synchronously, absolute form of a path with all intermediate components normalized and symbolic links resolved.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * path does not exist.
 * * A non-final component in path is not a directory.
 * * `allow-read` permission for {@linkcode path} is not provided.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * console.log(`absolute path: ${fs.canonicalizeSync(`./69420/").unwrap()}`);
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function canonicalizeSync(path: PathBuf) {
  return $resultSync(()=> Deno.realPathSync(path));
}

/**
 * Copies the contents of one file to another. This function will also copy the permission bits of the original file to the destination file.
 * 
 * This function will overwrite the contents of {@linkcode to}.
 * 
 * Note that if {@linkcode from} and {@linkcode to} both point to the same file, then the file will likely get truncated by this operation.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * {@linkcode from} is neither a regular file nor a symlink to a regular file.
 * * from does not exist.
 * * The current process does not have the permission rights to {@linkcode read} from or write to.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

await fs.copy("foo.txt", "bar.txt").unwrap();// Copy foo.txt to bar.txt
```
 * * **Requires**: `allow-read` permission on {@linkcode from} and `allow-write` permission on {@linkcode to}.
 */
export function copy(from: PathBuf,to: PathBuf) {
  return $result(()=> Deno.copyFile(from,to));
}

/**
 * Copies the contents of one file to another synchronously. This function will also copy the permission bits of the original file to the destination file.
 * 
 * This function will overwrite the contents of {@linkcode to}.
 * 
 * Note that if {@linkcode from} and {@linkcode to} both point to the same file, then the file will likely get truncated by this operation.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * {@linkcode from} is neither a regular file nor a symlink to a regular file.
 * * from does not exist.
 * * The current process does not have the permission rights to {@linkcode read} from or write to.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

fs.copySync("foo.txt", "bar.txt").unwrap();// Copy foo.txt to bar.txt
```
 * * **Requires**: `allow-read` permission on {@linkcode from} and `allow-write` permission on {@linkcode to}.
 */
export function copySync(from: PathBuf,to: PathBuf) {
  return $resultSync(()=> Deno.copyFileSync(from,to));
}

/**
 * Creates a new, empty directory at the provided path.
 * 
 * ### NOTE:
 * * If a parent of the given path doesn't exist, this function will return an error.
 * * To create a directory and all its missing parents at the same time pass the second {@linkcode options} argument.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * User lacks permissions to create directory at path.
 * * A parent of the given path doesn't exist. (To create a directory and all its missing parents at the same time pass the second {@linkcode options} argument { recursive: true }.)
 * * path already exists.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * await fs.createDir("/some/dir",{ recursive: true }).unwrap();
 * ```
 * * **Requires**: `allow-write` permission.
 */
export function createDir(path: PathBuf,options?: Deno.MkdirOptions) {
  return $result(()=> Deno.mkdir(path,options));
}

/**
 * Creates a new, empty directory at the provided path synchronously.
 * 
 * ### NOTE:
 * * If a parent of the given path doesn't exist, this function will return an error.
 * * To create a directory and all its missing parents at the same time pass the second {@linkcode options} argument.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * User lacks permissions to create directory at path.
 * * A parent of the given path doesn't exist. (To create a directory and all its missing parents at the same time pass the second {@linkcode options} argument { recursive: true }.)
 * * path already exists.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * fs.createDirSync("/some/dir",{ recursive: true }).unwrap();
 * ```
 * * **Requires**: `allow-write` permission.
 */
export function createDirSync(path: PathBuf,options?: Deno.MkdirOptions) {
  return $resultSync(()=> Deno.mkdirSync(path,options));
}

/**
 * Creates a new symbolic link on the filesystem.
 * 
 * The link path will be a symbolic link pointing to the original path.
 * 
 * ### Examples
 * ```ts
import fs from "@std/fs";

await fs.link("a.txt", "b.txt").unwrap();
```
 * * **Requires**: `allow-read` and `allow-write` permission.
 */
export function link(original: string,link: string) {
  return $result(()=> Deno.link(original,link));
}

/**
 * Creates a new symbolic link on the filesystem synchronously.
 * 
 * The link path will be a symbolic link pointing to the original path.
 * 
 * ### Examples
 * ```ts
import fs from "@std/fs";

fs.linkSync("a.txt", "b.txt").unwrap();
```
 * * **Requires**: `allow-read` and `allow-write` permission.
 */
export function linkSync(original: string,link: string) {
  return $resultSync(()=> Deno.linkSync(original,link));
}

/**
 * Given a path, query the file system to get information about a file, directory, etc.
 * 
 * This function will traverse symbolic links to query information about the destination file.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * The user lacks permissions to perform metadata call on path.
 * * path does not exist.
 * 
 * ### Examples
```ts
import fs from "@std/fs";


fs.metadata("/some/file/path.txt").unwrap();
```
 * * **Requires**: `allow-read` permission.
 */
export function metadata(path: PathBuf) {
  return $result(()=> Deno.stat(path));
}

/**
 * Given a path, query the file system to get information about a file, directory, etc synchronously.
 * 
 * This function will traverse symbolic links to query information about the destination file.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * The user lacks permissions to perform metadata call on path.
 * * path does not exist.
 * 
 * ### Examples
```ts
import fs from "@std/fs";


fs.metadataSync("/some/file/path.txt").unwrap();
```
 * * **Requires**: `allow-read` permission.
 */
export function metadataSync(path: PathBuf) {
  return $resultSync(()=> Deno.statSync(path));
}

/**
 * Read the entire contents of a file into bytes ({@linkcode Uint8Array}).
 * 
 * This is a convenience function for using {@linkcode FsFile.open}.
 * 
 * ### Errors
 * This function will return an error if path does not already exist. Other errors may also be returned according to {@linkcode Deno.OpenOptions}.
 * 
 * While reading from the file, this function handles {@linkcode Deno.errors.Interrupted} with automatic retries. See `io.Read` documentation for details.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

const buff = await fs.readFile("address.txt").unwrap();
```
 * * **Requires**: `allow-read` permission.
 */
export function readFile(path: PathBuf) {
  return $result(()=> Deno.readFile(path));
}

/**
 * Read the entire contents of a file into bytes ({@linkcode Uint8Array}) synchronously.
 * 
 * This is a convenience function for using {@linkcode FsFile.open}.
 * 
 * ### Errors
 * This function will return an error if path does not already exist. Other errors may also be returned according to {@linkcode Deno.OpenOptions}.
 * 
 * While reading from the file, this function handles {@linkcode Deno.errors.Interrupted} with automatic retries. See `io.Read` documentation for details.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

const buff = fs.readFileSync("address.txt").unwrap();
```
 * * **Requires**: `allow-read` permission.
 */
export function readFileSync(path: PathBuf) {
  return $resultSync(()=> Deno.readFileSync(path));
}

/**
 * Returns an {@linkcode Result} of {@linkcode AsyncIterable} over the entries within a directory.
 * 
 * The iterator will yield instances of {@linkcode Deno.DirEntry}
 * Entries for the current and parent directories (typically `.` and `..`) are skipped.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * The provided path doesn't exist.
 * * The process lacks permissions to view the contents.
 * * The path points at a non-directory file.
 * 
 * ### Examples
 * 
 * ```ts
 * // Example 1
 * import fs from "@std/fs";
 * 
 * // one possible implementation of walking a directory only visiting files
 * async function visitDir(dir: string,f: (entry: Deno.DirEntry)=> void) {
 *   for await(const entry of fs.readDir(dir).unwrap()) {
 *     if(entry.isDirectory) {
 *       await visitDir(entry.name);
 *     } else {
 *       f(entry);
 *     }
 *   }
 * }
 * 
 * 
 * // Example 2
 * import fs from "@std/fs";
 * 
 * for await(const entry of fs.readDir(".").unwrap()) {
 *   if(!entry.isFile) continue;
 *   console.log(entry.name);
 * }
 * 
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function readDir(path: PathBuf) {
  return Deno.readDir(path);
}

/**
 * Returns an {@linkcode Result} of {@linkcode Iterable} over the entries within a directory.
 * 
 * The iterator will yield instances of {@linkcode Deno.DirEntry}
 * Entries for the current and parent directories (typically `.` and `..`) are skipped.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * 
 * * The provided path doesn't exist.
 * * The process lacks permissions to view the contents.
 * * The path points at a non-directory file.
 * 
 * ### Examples
 * 
 * ```ts
 * // Example 1
 * import fs from "@std/fs";
 * 
 * // one possible implementation of walking a directory only visiting files
 * function visitDir(dir: string,f: (entry: Deno.DirEntry)=> void) {
 *   for (const entry of fs.readDirSync(dir).unwrap()) {
 *     if(entry.isDirectory) {
 *       visitDir(entry.name);
 *     } else {
 *       f(entry);
 *     }
 *   }
 * }
 * 
 * 
 * // Example 2
 * import fs from "@std/fs";
 * 
 * for(const entry of fs.readDirSync(".").unwrap()) {
 *   if(!entry.isFile) continue;
 *   console.log(entry.name);
 * }
 * 
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function readDirSync(path: PathBuf) {
  return $resultSync(()=> Deno.readDirSync(path));
}

/**
 * Reads a symbolic link, returning the file that the link points to.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * * path is not a symbolic link.
 * * path does not exist.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * const link = await fs.readLink("xd.txt").unwrap();
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function readLink(path: PathBuf) {
  return $result(()=> Deno.readLink(path));
}

/**
 * Reads a symbolic link synchronously, returning the file that the link points to.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * * path is not a symbolic link.
 * * path does not exist.
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * const link = fs.readLinkSync("xd.txt").unwrap();
 * ```
 * * **Requires**: `allow-read` permission.
 */
export function readLinkSync(path: PathBuf) {
  return $resultSync(()=> Deno.readLinkSync(path));
}

/**
 * Read the entire contents of a file into a string.
 * 
 * This is a convenience function for using {@linkcode FsFile.open} with fewer imports and without an intermediate variable.
 * 
 * ### Errors
 * This function will return an error if path does not already exist. Other errors may also be returned according to [OpenOptions::open].
 * 
 * * If the contents of the file are not valid UTF-8, then an error will also be returned.
 * * While reading from the file, this function handles [io::ErrorKind::Interrupted] with automatic retries. See [io::Read] documentation for details.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

const msg=await fs.readToString("message.txt").unwrap();
console.log(msg);
```
 * * **Requires**: `allow-read` permission.
 */
export function readToString(path: PathBuf,options?: Deno.ReadFileOptions) {
  return $result(()=> Deno.readTextFile(path,options));
}

/**
 * Read the entire contents of a file into a string synchronously.
 * 
 * This is a convenience function for using {@linkcode FsFile.open} with fewer imports and without an intermediate variable.
 * 
 * ### Errors
 * This function will return an error if path does not already exist. Other errors may also be returned according to [OpenOptions::open].
 * 
 * * If the contents of the file are not valid UTF-8, then an error will also be returned.
 * * While reading from the file, this function handles [io::ErrorKind::Interrupted] with automatic retries. See [io::Read] documentation for details.
 * 
 * ### Examples
```ts
import fs from "@std/fs";

const msg=fs.readToStringSync("message.txt").unwrap();
console.log(msg);
```
 * * **Requires**: `allow-read` permission.
 */
export function readToStringSync(path: PathBuf) {
  return $resultSync(()=> Deno.readTextFileSync(path));
}

/**
 * Removes a directory.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * * path doesn't exist.
 * * path isn't a directory.
 * * The user lacks permissions to remove the directory at the provided path.
 * * The directory isn't empty. (To remove a non-empty directory pass the second {@linkcode options} argument { recursive: true }.)
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * await fs.removeDir("/some/dir").unwrap();
 * ```
 * * **Requires**: `allow-write` permission.
 */
export function removeDir(path: PathBuf,options?: Deno.RemoveOptions) {
  return $result(()=> Deno.remove(path,options));
}

/**
 * Removes a directory synchronously.
 * 
 * ### Errors
 * This function will return an error in the following situations, but is not limited to just these cases:
 * * path doesn't exist.
 * * path isn't a directory.
 * * The user lacks permissions to remove the directory at the provided path.
 * * The directory isn't empty. (To remove a non-empty directory pass the second {@linkcode options} argument { recursive: true }.)
 * 
 * ### Examples
 * ```ts
 * import fs from "@std/fs";
 * 
 * fs.removeDirSync("/some/dir").unwrap();
 * ```
 * * **Requires**: `allow-write` permission.
 */
export function removeDirSync(path: PathBuf,options?: Deno.RemoveOptions) {
  return $resultSync(()=> Deno.removeSync(path,options));
}

/**
 * Renames (moves) oldpath to newpath. Paths may be files or directories. If newpath already exists and is not a directory, rename() replaces it. OS-specific restrictions may apply when oldpath and newpath are in different directories.
 * 
 * ### Example
 * ```ts
 * import fs from "@std/fs";
 * 
 * await fs.rename("old/path", "new/path".unwrap());
 * ```
 * * **Requires**: `allow-read` and `allow-write` permissions.
 */
export function rename(oldpath: PathBuf,newpath: PathBuf) {
  return $result(()=> Deno.rename(oldpath,newpath));
}

/**
 * Renames (moves) oldpath to newpath synchronously.
 * Paths may be files or directories. If newpath already exists and is not a directory, rename() replaces it. OS-specific restrictions may apply when oldpath and newpath are in different directories.
 * 
 * ### Example
 * ```ts
 * import fs from "@std/fs";
 * 
 * await fs.rename("old/path", "new/path".unwrap());
 * ```
 * * **Requires**: `allow-read` and `allow-write` permissions.
 */
export function renameSync(oldpath: PathBuf,newpath: PathBuf) {
  return $resultSync(()=> Deno.renameSync(oldpath,newpath));
}

/**
 * Changes the permission of a specific file/directory of specified path.
 * Ignores the process's umask.
 * 
 * The mode is a sequence of 3 octal numbers.
 * The first/left-most number specifies the permissions for the owner.
 * The second number specifies the permissions for the group.
 * The last/right-most number specifies the permissions for others.
 * For example, with a mode of 0o764, the owner (7) can read/write/execute, the group (6) can read/write and everyone else (4) can read only.
 * 
 * | Number | Description |
 * | ------ | ----------- |
 * | 7      | read, write, and execute |
 * | 6      | read and write |
 * | 5      | read and execute |
 * | 4      | read only |
 * | 3      | write and execute |
 * | 2      | write only |
 * | 1      | execute only |
 * | 0      | no permission |
 * 
 * **NOTE**: This API currently throws on Windows
 * ### Example
```ts
import fs from "@std/fs";

await fs.chmod("/path/to/file", 0o666).unwrap();
```
 * * **Requires**: `allow-write` permission.
 */
export function chmod(path: PathBuf,mode: number) {
  return $result(()=> Deno.chmod(path,mode));
}

/**
 * Changes the permission of a specific file/directory of specified path synchronously.
 * Ignores the process's umask.
 * 
 * The mode is a sequence of 3 octal numbers.
 * The first/left-most number specifies the permissions for the owner.
 * The second number specifies the permissions for the group.
 * The last/right-most number specifies the permissions for others.
 * For example, with a mode of 0o764, the owner (7) can read/write/execute, the group (6) can read/write and everyone else (4) can read only.
 * 
 * | Number | Description |
 * | ------ | ----------- |
 * | 7      | read, write, and execute |
 * | 6      | read and write |
 * | 5      | read and execute |
 * | 4      | read only |
 * | 3      | write and execute |
 * | 2      | write only |
 * | 1      | execute only |
 * | 0      | no permission |
 * 
 * **NOTE**: This API currently throws on Windows
 * ### Example
```ts
import fs from "@std/fs";

fs.chmodSync("/path/to/file", 0o666).unwrap();
```
 * * **Requires**: `allow-write` permission.
 */
export function chmodSync(path: PathBuf,mode: number) {
  return $resultSync(()=> Deno.chmodSync(path,mode));
}

/**
 * Change owner of a regular file or directory.
 * 
 * **Warning**: This functionality is not available on Windows.
 * Throws Error (not implemented) if executed on Windows.
 * 
 * ### Example
```ts
import fs from "@std/fs";

await fs.chown("myFile.txt", 1000, 1002);
```
 * * **Requires**: `allow-write` permission.
 * <hr>
@param - path path to the file
@param - uid user id (UID) of the new owner, or null for no change
@param - gid group id (GID) of the new owner, or null for no change
 */
export function chown(path: PathBuf,uid: number|null,gid: number|null) {
  return $result(()=> Deno.chown(path,uid,gid));
}

/**
 * Change owner of a regular file or directory synchronously.
 * 
 * **Warning**: This functionality is not available on Windows.
 * Throws Error (not implemented) if executed on Windows.
 * 
 * ### Example
```ts
import fs from "@std/fs";

fs.chownSync("myFile.txt", 1000, 1002);
```
 * * **Requires**: `allow-write` permission.
 * <hr>
@param - path path to the file
@param - uid user id (UID) of the new owner, or null for no change
@param - gid group id (GID) of the new owner, or null for no change
 */
export function chownSync(path: PathBuf,uid: number|null,gid: number|null) {
  return $resultSync(()=> Deno.chownSync(path,uid,gid));
}

export function symlinkMetadata(path: PathBuf) {
  return $result(()=> Deno.lstat(path));
}

export function symlinkMetadataSync(path: PathBuf) {
  return $resultSync(()=> Deno.lstatSync(path));
}

export function writeFile(path: PathBuf,data: Uint8Array|ReadableStream<Uint8Array>,options?: Deno.WriteFileOptions) {
  return $result(()=> Deno.writeFile(path,data,options));
}

export function writeFileSync(path: PathBuf,data: Uint8Array,options?: Deno.WriteFileOptions) {
  return $resultSync(()=> Deno.writeFileSync(path,data,options));
}

export function writeTextFile(path: PathBuf,data: string|ReadableStream<string>,options?: Deno.WriteFileOptions) {
  return $result(()=> Deno.writeTextFile(path,data,options));
}

export function writeTextFileSync(path: PathBuf,data: string,options?: Deno.WriteFileOptions) {
  return $resultSync(()=> Deno.writeTextFileSync(path,data,options));
}

export function makeTempDir(options: Deno.MakeTempOptions) {
  return $result(()=> Deno.makeTempDir(options));
}

export function makeTempDirSync(options: Deno.MakeTempOptions) {
  return $resultSync(()=> Deno.makeTempDirSync(options));
}

export function makeTempFile(options: Deno.MakeTempOptions) {
  return $result(()=> Deno.makeTempFile(options));
}

export function makeTempFileSync(options: Deno.MakeTempOptions) {
  return $resultSync(()=> Deno.makeTempFileSync(options));
}

export function truncate(name: string,len?: number) {
  return $result(()=> Deno.truncate(name,len));
}

export function truncateSync(name: string,len?: number) {
  return $resultSync(()=> Deno.truncateSync(name,len));
}

export function open(path: string, options?: Deno.OpenOptions) {
  return FsFile.open(path,options);
}


export function openSync(path: string, options?: Deno.OpenOptions) {
  return FsFile.openSync(path,options);
}

export function create(path: string) {
  return FsFile.create(path);
}

export function createSync(path: string) {
  return FsFile.createSync(path);
}