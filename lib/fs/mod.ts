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


export function copy(from: PathBuf,to: PathBuf) {
  return $result(()=> Deno.copyFile(from,to));
}

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

export function link(original: string,link: string) {
  return $result(()=> Deno.link(original,link));
}

export function linkSync(original: string,link: string) {
  return $resultSync(()=> Deno.linkSync(original,link));
}

export function metadata(path: PathBuf) {
  return $result(()=> Deno.stat(path));
}

export function metadataSync(path: PathBuf) {
  return $resultSync(()=> Deno.statSync(path));
}

export function readFile(path: PathBuf) {
  return $result(()=> Deno.readFile(path));
}

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
 */
export function readDirSync(path: PathBuf) {
  return $resultSync(()=> Deno.readDirSync(path));
}

export function readLink(path: PathBuf) {
  return $result(()=> Deno.readLink(path));
}

export function readLinkSync(path: PathBuf) {
  return $resultSync(()=> Deno.readLinkSync(path));
}

export function readToString(path: PathBuf,options?: Deno.ReadFileOptions) {
  return $result(()=> Deno.readTextFile(path,options));
}

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

export function chmod(path: PathBuf,mode: number) {
  return $result(()=> Deno.chmod(path,mode));
}

export function chmodSync(path: PathBuf,mode: number) {
  return $resultSync(()=> Deno.chmodSync(path,mode));
}

export function chown(path: PathBuf,uid: number|null,gid: number|null) {
  return $result(()=> Deno.chown(path,uid,gid));
}

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