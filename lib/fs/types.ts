

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
export type SeekFrom=0|1|2;
export const SeekFrom={
  Start: 0,
  Current: 1,
  End: 2
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

