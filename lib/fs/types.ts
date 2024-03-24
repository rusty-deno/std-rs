import { Option } from '../error/option/option.ts';


/** Representation of the various timestamps on a file. */
export interface FileTimes {
  accessed: number|Date,
  modified: number|Date
}


///////////
// Enums //
///////////

/**
 * Enumeration of possible methods to seek within an I/O object.
 */
export type SeekFrom=typeof SeekFrom[keyof typeof SeekFrom];
export const SeekFrom={
  Start: 0 as const,
  Current: 1 as const,
  End: 2 as const
};

/**
 * Representation of the various permissions on a file.
 */
export type Permission=number;
export const Permission={
  None: 0,
  Executeonly: 1,
  Writeonly: 2,
  WriteExecute: 3,
  Readonly: 4,
  ReadExecule: 5,
  ReadWrite: 6,
  All: 7,
};

/**
 * Metadata information about a file.
 * 
 * It represents known metadata about a file such as its permissions, size, modification times, etc.
 */
export interface Metadata {
  /** True if this is info for a regular file. Mutually exclusive to
   * `FileInfo.isDirectory` and `FileInfo.isSymlink`. */
  readonly isFile: boolean;
  /** True if this is info for a regular directory. Mutually exclusive to
   * `FileInfo.isFile` and `FileInfo.isSymlink`. */
  readonly isDirectory: boolean;
  /** True if this is info for a symlink. Mutually exclusive to
   * `FileInfo.isFile` and `FileInfo.isDirectory`. */
  readonly isSymlink: boolean;
  /** The size of the file, in bytes. */
  readonly size: number;
  /** The last modification time of the file. This corresponds to the `mtime`
   * field from `stat` on Linux/Mac OS and `ftLastWriteTime` on Windows. This
   * may not be available on all platforms. */
  readonly mtime: Option<Date>;
  /** The last access time of the file. This corresponds to the `atime`
   * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
   * be available on all platforms. */
  readonly atime: Option<Date>;
  /** The creation time of the file. This corresponds to the `birthtime`
   * field from `stat` on Mac/BSD and `ftCreationTime` on Windows. This may
   * not be available on all platforms. */
  readonly birthtime: Option<Date>;
  /** ID of the device containing the file. */
  readonly dev: number;
  /** Inode number.
   *
   * _Linux/Mac OS only._ */
  readonly ino: Option<number>;
  /** The underlying raw `st_mode` bits that contain the standard Unix
   * permissions for this file/directory.
   *
   * _Linux/Mac OS only._ */
  readonly permissions: Option<number>;
  /** Number of hard links pointing to this file.
   *
   * _Linux/Mac OS only._ */
  readonly nlink: Option<number>;
  /** User ID of the owner of this file.
   *
   * _Linux/Mac OS only._ */
  readonly uid: Option<number>;
  /** Group ID of the owner of this file.
   *
   * _Linux/Mac OS only._ */
  readonly gid: Option<number>;
  /** Device ID of this file.
   *
   * _Linux/Mac OS only._ */
  readonly rdev: Option<number>;
  /** Blocksize for filesystem I/O.
   *
   * _Linux/Mac OS only._ */
  readonly blksize: Option<number>;
  /** Number of blocks allocated to the file, in 512-byte units.
   *
   * _Linux/Mac OS only._ */
  readonly blocks: Option<number>;
  /**  True if this is info for a block device.
   *
   * _Linux/Mac OS only._ */
  readonly isBlockDevice: Option<boolean>;
  /**  True if this is info for a char device.
   *
   * _Linux/Mac OS only._ */
  readonly isCharDevice: Option<boolean>;
  /**  True if this is info for a fifo.
   *
   * _Linux/Mac OS only._ */
  readonly isFifo: Option<boolean>;
  /**  True if this is info for a socket.
   *
   * _Linux/Mac OS only._ */
  readonly isSocket: Option<boolean>;
}


