
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

