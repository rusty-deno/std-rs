import { ErrorTrait } from '../error/error_trait.ts';
import { Option,None } from "../error/option/option.ts";
import { Enum } from "../types.ts";


export type ErrorKind=Enum<typeof ErrorKind>;
/**
 * A list specifying general categories of I/O error.
 * 
 * This list is intended to grow over time and it is not recommended to exhaustively match against it.
 * 
 * It is used with the {@linkcode IoError} type.
 * 
 * Handling errors and matching on {@linkcode ErrorKind}
 * In application code, use match for the {@linkcode ErrorKind} values you are expecting;
 * use `default` to match "all other errors".
 * 
 * In comprehensive and thorough tests that want to verify that a test doesn't return any known incorrect error kind,
 * you may want to cut-and-paste the current full list of errors from here into your test code,
 * and then match `default` as the correct case.
 * This seems counterintuitive, but it will make your tests more robust.
 * In particular, if you want to verify that your code does produce an unrecognized error kind,
 * the robust solution is to check for all the recognized error kinds and fail in those cases.
 */
export const ErrorKind={
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
   * `InvalidInput`: {@linkcode ErrorKind.InvalidInput}
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
   * ErrorKinds which are primarily categorisations for OS error codes should be added above.
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
   * This `ErrorKind` is not used by the standard library.
   * Errors from the standard library that do not fall under any of the I/O
   * 
   * New `ErrorKind`s might be added in the future.
   */
  Other: 0x27,
  /**
   * Any I/O error from the standard library that's not part of this list.
   * 
   * Errors that are `Uncategorized` now may move to a different or a new `ErrorKind` variant in the future.
   * It is not recommended to match an error against `Uncategorized`; use a `default` instead.
   */
  Uncategorized: 0x28,
} as const;


export class IoError extends ErrorTrait {
  #rawOsErr: number|null=null;
  constructor(kind: ErrorKind,error: Error|string,cause?: string) {
    super(kind,error,cause);
  }

  public static fromRawOsError(code: number): IoError {
    const kind=encodeErrorKind(code);
    return new IoError(kind,encodeError(kind));
  }

  public static other(error: Error|string) {
    return new IoError(ErrorKind.Uncategorized,error);
  }


  public rawOsError(): Option<number> {
    return None();
  }

  public kind(): number {
    return 0;
  }
}


function encodeErrorKind(_code: number): ErrorKind {
  return ErrorKind.Uncategorized;
}

function encodeError(kind: ErrorKind): string {
  switch(kind) {
    case ErrorKind.Uncategorized: return "uncategorized";
    default: return "";
  }
}


