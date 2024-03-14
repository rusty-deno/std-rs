import { PathBuf } from '../path.ts';
import { createDirSync,createDir } from './mod.ts';

/**
 * A builder used to create directories in various manners.
 */
export class DirBuilder {

  /**
   * Asynchronyously creates the specified directory with the options configured.
   * 
   * It is considered an error if the directory already exists unless recursive mode is enabled.
   * 
   * ### Examples
   * ```ts
   * import { DirBuilder } from "@std/fs";
   * 
   * const path = "/tmp/foo/bar/baz";
   * await DirBuilder
   * .create(path).unwrap();
   * 
   * $assert(fs.metadata(path).unwrap().isDirectory);
   * ```
   */
  public static create(path: PathBuf,options: Deno.MkdirOptions) {
    return createDir(path,options);
  }

  /**
   * Synchronyously creates the specified directory with the options configured.
   * 
   * It is considered an error if the directory already exists unless recursive mode is enabled.
   * 
   * ### Examples
   * ```ts
   * import { DirBuilder } from "@std/fs";
   * 
   * const path = "/tmp/foo/bar/baz";
   * DirBuilder
   * .createSync(path).unwrap();
   * 
   * $assert(fs.metadata(path).unwrap().isDirectory);
   * ```
   */
  public static createSync(path: PathBuf,options: Deno.MkdirOptions) {
    return createDirSync(path,options);
  }
}



