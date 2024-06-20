import { ErrorTrait } from '../error/error_trait.ts';
import { Option } from "../error/option/option.ts";
import { Enum } from "../types.ts";


export type IoErrorKind=Enum<typeof IoErrorKind>;
/**
 * A list specifying general categories of I/O error.
 * 
 * This list is intended to grow over time and it is not recommended to exhaustively match against it.
 * 
 * It is used with the {@linkcode IoError} type.
 * 
 * Handling errors and matching on {@linkcode IoErrorKind}
 * In application code, use match for the {@linkcode IoErrorKind} values you are expecting;
 * use `default` to match "all other errors".
 * 
 * In comprehensive and thorough tests that want to verify that a test doesn't return any known incorrect error kind,
 * you may want to cut-and-paste the current full list of errors from here into your test code,
 * and then match `default` as the correct case.
 * This seems counterintuitive, but it will make your tests more robust.
 * In particular, if you want to verify that your code does produce an unrecognized error kind,
 * the robust solution is to check for all the recognized error kinds and fail in those cases.
 */
export const IoErrorKind={
  /** An entity was not found, often a file. */
  NotFound: 0x0,
  /** The operation lacked the necessary privileges to complete. */
  PermissionDenied: 0x1,
  /** The connection was refused by the remote server. */
  ConnectionRefused: 0x2,
  /** The connection was reset by the remote server. */
  ConnectionReset: 0x3,
  /** The remote host is not reachable. */
  HostUnreachable: 0x4,
  /** The network containing the remote host is not reachable. */
  NetworkUnreachable: 0x5,
  /** The connection was aborted (terminated) by the remote server. */
  ConnectionAborted: 0x6,
  /** The network operation failed because it was not connected yet. */
  NotConnected: 0x7,
  /** A socket address could not be bound because the address is already in use elsewhere. */
  AddrInUse: 0x8,
  /** A nonexistent interface was requested or the requested address was not local. */
  AddrNotAvailable: 0x9,
  /** The system's networking is down. */
  NetworkDown: 0xA,
  /** The operation failed because a pipe was closed. */
  BrokenPipe: 0xB,
  /** An entity already exists, often a file. */
  AlreadyExists: 0xC,
  /** The operation needs to block to complete, but the blocking operation was requested to not occur. */
  WouldBlock: 0xD,
  /**
   * A filesystem object is, unexpectedly, not a directory.
   * 
   * For example, a filesystem path was specified where one of the intermediate directory
   * components was, in fact, a plain file.
   */
  NotADirectory: 0xE,
  /**
   * The filesystem object is, unexpectedly, a directory.
   * 
   * A directory was specified when a non-directory was expected.
   */
  IsADirectory: 0xF,
  /** A non-empty directory was specified where an empty directory was expected. */
  DirectoryNotEmpty: 0x10,
  /** The filesystem or storage medium is read-only, but a write operation was attempted. */
  ReadOnlyFilesystem: 0x11,
  /** 
   * Loop in the filesystem or IO subsystem; often, too many levels of symbolic links.
   * 
   * There was a loop (or excessively long chain) resolving a filesystem object
   * or file IO object.
   * 
   * On Unix this is usually the result of a symbolic link loop; or, of exceeding the
   * system-specific limit on the depth of symlink traversal.
   */
  FilesystemLoop: 0x12,
  /**
   * Stale network file handle.
   * 
   * With some network filesystems, notably NFS, an open file (or directory) can be invalidated
   * by problems with the network or server.
   */
  StaleNetworkFileHandle: 0x13,
  /** A parameter was incorrect. */
  InvalidInput: 0x14,
  /**
   * Data not valid for the operation were encountered.
   * 
   * Unlike `InvalidInput`, this typically means that the operation
   * parameters were valid, however the error was caused by malformed input data.
   * For example, a function that reads a file into a string will error with
   * `InvalidData` if the file's contents are not valid `UTF-8`.
   * 
   * `InvalidInput`: {@linkcode IoErrorKind.InvalidInput}
   */
  InvalidData: 0x15,
  /** The I/O operation's timeout expired, causing it to be canceled. */
  TimedOut: 0x16,
  /**
   * An error returned when an operation could not be completed because a
   * call to `write` returned `Ok(0)`.
   * 
   * This typically means that an operation could only succeed if it wrote a
   * particular number of bytes but only a smaller number of bytes could be written.
   * 
   * `write`: {@linkcode Write.write}
   * `Ok(0)`: {@linkcode Ok}
   */
  WriteZero: 0x17,
  /**
   * The underlying storage (typically, a filesystem) is full.
   * 
   * This does not include out of quota errors.
   */
  StorageFull: 0x18,
  /** Seek on unseekable file.
   * 
   * Seeking was attempted on an open file handle which is not suitable for seeking - for
   * example, on Unix, a named pipe opened with `FsFile.open`.
   */
  NotSeekable: 0x19,
  /** Filesystem quota was exceeded. */
  FilesystemQuotaExceeded: 0x1A,
  /**
   * File larger than allowed or supported.
   * 
   * This might arise from a hard limit of the underlying filesystem or file access API, or from
   * an administratively imposed resource limitation.
   * Simple disk full, and out of quota, have their own errors.
   */
  FileTooLarge: 0x1B,
  /** Resource is busy. */
  ResourceBusy: 0x1C,
  /**
   * Executable file is busy.
   * 
   * An attempt was made to write to a file which is also in use as a running program.
   * (Not all operating systems detect this situation.)
   */
  ExecutableFileBusy: 0x1D,
  /** Deadlock (avoided).
   * 
   * A file locking operation would result in deadlock.
   * This situation is typically detected,
   * if at all, on a best-effort basis.
   */
  Deadlock: 0x1E,
  /** Cross-device or cross-filesystem (hard) link or rename. */
  CrossesDevices: 0x1F,
  /**
   * Too many (hard) links to the same filesystem object.
   * 
   * The filesystem does not support making so many hardlinks to the same file.
   */
  TooManyLinks: 0x20,
  /**
   * A filename was invalid.
   * 
   * This error can also cause if it exceeded the filename length limit.
   */
  InvalidFilename: 0x21,
  /**
   * Program argument list too long.
   * 
   * When trying to run an external program, a system or process limit on the size of the arguments would have been exceeded.
   */
  ArgumentListTooLong: 0x22,
  /** This operation was interrupted.
   * 
   * Interrupted operations can typically be retried.
   */
  Interrupted: 0x23,
  /**
   * This operation is unsupported on this platform.
   * 
   * This means that the operation can never succeed.
   */
  Unsupported: 0x24,
  /**
   * `ErrorKind`s which are primarily categorisations for OS error codes should be added above.
   * 
   * An error returned when an operation could not be completed because an "end of file" was reached prematurely.
   * 
   * This typically means that an operation could only succeed if it read a particular number of bytes but only a smaller number of bytes could be read.
   */
  UnexpectedEof: 0x25,
  /**
   * An operation could not be completed, because it failed to allocate enough memory.
   */
  OutOfMemory: 0x26,
  /**
   * "Unusual" error kinds which do not correspond simply to (sets of) OS error codes,
   * should be added just above this comment.
   * `Other` and `Uncategorized` should remain at the end:
   * 
   * A custom error that does not fall under any other I/O error kind.
   * 
   * This can be used to construct your own `Error`s that do not match any {@linkcode ErrorKind}.
   * 
   * This `IoErrorKind` is not used by the standard library.
   * Errors from the standard library that do not fall under any of the I/O
   * 
   * New `IoErrorKind`s might be added in the future.
   */
  Other: 0x27,
  /**
   * Any I/O error from the standard library that's not part of this list.
   * 
   * Errors that are `Uncategorized` now may move to a different or a new `IoErrorKind` variant in the future.
   * It is not recommended to match an error against `Uncategorized`; use a `default` instead.
   */
  Uncategorized: 0x28,
} as const;

/** String representation of various {@linkcode ErrorKind}s */
export type ErrorKindStr=
|"address in use"
|"address not available"
|"entity already exists"
|"argument list too long"
|"broken pipe"
|"connection aborted"
|"connection refused"
|"connection reset"
|"cross-device link or rename"
|"deadlock"
|"directory not empty"
|"executable file busy"
|"file too large"
|"filesystem loop or indirection limit (e.g. symlink loop)"
|"filesystem quota exceeded"
|"host unreachable"
|"operation interrupted"
|"invalid data"
|"invalid filename"
|"invalid input parameter"
|"is a directory"
|"network down"
|"network unreachable"
|"not a directory"
|"not connected"
|"entity not found"
|"seek on unseekable file"
|"other error"
|"out of memory"
|"permission denied"
|"read-only filesystem or storage medium"
|"resource busy"
|"stale network file handle"
|"no storage space"
|"timed out"
|"too many links"
|"uncategorized error"
|"unexpected end of file"
|"unsupported"
|"operation would block"
|"write zero";


/**
 * The error type for I/O operations of the {@linkcode Read}, {@linkcode Write}, {@linkcode Seek},
 * and associated traits.
 * 
 * Errors mostly originate from the underlying OS,
 * but custom instances of Error can be created with crafted error messages and a particular value of {@linkcode IoErrorKind}.
 */
export class IoError extends ErrorTrait {
  #rawOsErr: number|null=null;
  constructor(kind: IoErrorKind,error: Error|string,cause?: string) {
    super(kind,error,cause);
  }

  /**
   * Creates a new instance of an [Error] from a particular OS error code.
   * 
   * ## Examples
   * On Linux:
  ```ts
  import { IoError,IoErrorKind } from "std/io";
  
  const error = IoError.fromRawOsError(22);
  $assertEq(error.kind(),IoErrorKind.InvalidInput);
  ```
   * On Windows:
  ```ts
  import { IoError,IoErrorKind } from "std/io";
  
  const error = IoError.fromRawOsError(10022);
  $assertEq(error.kind(),IoErrorKind.InvalidInput);
  ```
   */
  public static fromRawOsError(code: number): IoError {
    const kind=encodeIoErrorKind(code);
    const self=new IoError(kind,asStr(kind));
    self.#rawOsErr=code;

    return self;
  }

  /**
   * Creates a new I/O error from an arbitrary error payload.
   * 
   * This function is used to generically create I/O errors which do not originate from the OS itself.
   * It is a shortcut for {@linkcode constructor} with {@linkcode IoErrorKind.Other}.
   * 
   * ## Examples
  ```ts
  import { IoError,IoErrorKind } from "std/io";
  
  // errors can be created from strings
  const customError = IoError.other("oh no!");
  
  // errors can also be created from other errors
  const custom_error2 = IoError.other(customError);
  ```
   */
  public static other(error: Error|string) {
    return new IoError(IoErrorKind.Other,error);
  }

  /**
   * Returns the OS error that this error represents (if any).
   * 
   * If this {@linkcode IoError} was constructed via {@linkcode fromRawOsError},
   * then this function will return {@linkcode Some}, otherwise it will return {@linkcode None}.
   */
  public rawOsError(): Option<number> {
    return new Option(this.#rawOsErr);
  }

  /**
   * Returns the corresponding {@linkcode IoErrorKind} for this error.
   * 
   * This may be a value set by Rust code constructing custom {@linkcode IoError}s,
   * or if this {@linkcode IoError} was sourced from the operating system,
   * it will be a value inferred from the system's error encoding.
   */
  public kind(): IoErrorKind {
    return this.__kind as IoErrorKind;
  }
}


function encodeIoErrorKind(_code: number): IoErrorKind {
  return IoErrorKind.Uncategorized;
}

export function encodeToIoErrorKind(str: string): IoErrorKind {
  switch(str) {
    case "address in use": return IoErrorKind.AddrInUse;
    case "address not available": return IoErrorKind.AddrNotAvailable;
    case "entity already exists": return IoErrorKind.AlreadyExists;
    case "argument list too long": return IoErrorKind.ArgumentListTooLong;
    case "broken pipe": return IoErrorKind.BrokenPipe;
    case "connection aborted": return IoErrorKind.ConnectionAborted;
    case "connection refused": return IoErrorKind.ConnectionRefused;
    case "connection reset": return IoErrorKind.ConnectionReset;
    case "cross-device link or rename": return IoErrorKind.CrossesDevices;
    case "deadlock": return IoErrorKind.Deadlock;
    case "directory not empty": return IoErrorKind.DirectoryNotEmpty;
    case "executable file busy": return IoErrorKind.ExecutableFileBusy;
    case "file too large": return IoErrorKind.FileTooLarge;
    case "filesystem loop or indirection limit (e.g. symlink loop)": return IoErrorKind.FilesystemLoop;
    case "filesystem quota exceeded": return IoErrorKind.FilesystemQuotaExceeded;
    case "host unreachable": return IoErrorKind.HostUnreachable;
    case "operation interrupted": return IoErrorKind.Interrupted;
    case "invalid data": return IoErrorKind.InvalidData;
    case "invalid filename": return IoErrorKind.InvalidFilename;
    case "invalid input parameter": return IoErrorKind.InvalidInput;
    case "is a directory": return IoErrorKind.IsADirectory;
    case "network down": return IoErrorKind.NetworkDown;
    case "network unreachable": return IoErrorKind.NetworkUnreachable;
    case "not a directory": return IoErrorKind.NotADirectory;
    case "not connected": return IoErrorKind.NotConnected;
    case "entity not found": return IoErrorKind.NotFound;
    case "seek on unseekable file": return IoErrorKind.NotSeekable;
    case "other error": return IoErrorKind.Other;
    case "out of memory": return IoErrorKind.OutOfMemory;
    case "permission denied": return IoErrorKind.PermissionDenied;
    case "read-only filesystem or storage medium": return IoErrorKind.ReadOnlyFilesystem;
    case "resource busy": return IoErrorKind.ResourceBusy;
    case "stale network file handle": return IoErrorKind.StaleNetworkFileHandle;
    case "no storage space": return IoErrorKind.StorageFull;
    case "timed out": return IoErrorKind.TimedOut;
    case "too many links": return IoErrorKind.TooManyLinks;
    case "uncategorized error": return IoErrorKind.Uncategorized;
    case "unexpected end of file": return IoErrorKind.UnexpectedEof;
    case "unsupported": return IoErrorKind.Unsupported;
    case "operation would block": return IoErrorKind.WouldBlock;
    case "write zero": return IoErrorKind.WriteZero;
    default: return IoErrorKind.Other;
  }
}

function asStr(kind: IoErrorKind): ErrorKindStr {
  switch(kind) {
    case IoErrorKind.AddrInUse: return "address in use";
    case IoErrorKind.AddrNotAvailable: return "address not available";
    case IoErrorKind.AlreadyExists: return "entity already exists";
    case IoErrorKind.ArgumentListTooLong: return "argument list too long";
    case IoErrorKind.BrokenPipe: return "broken pipe";
    case IoErrorKind.ConnectionAborted: return "connection aborted";
    case IoErrorKind.ConnectionRefused: return "connection refused";
    case IoErrorKind.ConnectionReset: return "connection reset";
    case IoErrorKind.CrossesDevices: return "cross-device link or rename";
    case IoErrorKind.Deadlock: return "deadlock";
    case IoErrorKind.DirectoryNotEmpty: return "directory not empty";
    case IoErrorKind.ExecutableFileBusy: return "executable file busy";
    case IoErrorKind.FileTooLarge: return "file too large";
    case IoErrorKind.FilesystemLoop: return "filesystem loop or indirection limit (e.g. symlink loop)";
    case IoErrorKind.FilesystemQuotaExceeded: return "filesystem quota exceeded";
    case IoErrorKind.HostUnreachable: return "host unreachable";
    case IoErrorKind.Interrupted: return "operation interrupted";
    case IoErrorKind.InvalidData: return "invalid data";
    case IoErrorKind.InvalidFilename: return "invalid filename";
    case IoErrorKind.InvalidInput: return "invalid input parameter";
    case IoErrorKind.IsADirectory: return "is a directory";
    case IoErrorKind.NetworkDown: return "network down";
    case IoErrorKind.NetworkUnreachable: return "network unreachable";
    case IoErrorKind.NotADirectory: return "not a directory";
    case IoErrorKind.NotConnected: return "not connected";
    case IoErrorKind.NotFound: return "entity not found";
    case IoErrorKind.NotSeekable: return "seek on unseekable file";
    case IoErrorKind.Other: return "other error";
    case IoErrorKind.OutOfMemory: return "out of memory";
    case IoErrorKind.PermissionDenied: return "permission denied";
    case IoErrorKind.ReadOnlyFilesystem: return "read-only filesystem or storage medium";
    case IoErrorKind.ResourceBusy: return "resource busy";
    case IoErrorKind.StaleNetworkFileHandle: return "stale network file handle";
    case IoErrorKind.StorageFull: return "no storage space";
    case IoErrorKind.TimedOut: return "timed out";
    case IoErrorKind.TooManyLinks: return "too many links";
    case IoErrorKind.Uncategorized: return "uncategorized error";
    case IoErrorKind.UnexpectedEof: return "unexpected end of file";
    case IoErrorKind.Unsupported: return "unsupported";
    case IoErrorKind.WouldBlock: return "operation would block";
    case IoErrorKind.WriteZero: return "write zero";
  }
}


