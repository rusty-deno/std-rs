

/**
 * # Panics
 * Exits the program with custom panic message provided by {@linkcode msg}.
 */
export function $panic(msg: string|Error="Program panicked.."): never {
  console.error(msg);
  // throw msg instanceof Error?msg:new Error(msg);
  Deno.exit(1);
}

/**
 * Indicates unfinished code.
 * 
 * This can be useful if you're prototyping and just want a placeholder to let your code pass type analysis.
 * 
 * # Panics
 * Always panics
 */
export function $todo(msg="following code hasn't been implemented yet."): never {
  throw msg;
}

/**
 * Indicates unimplemented code by panicking with a message of "not implemented".
 * 
 * This allows your code to type-check, which is useful if you're prototyping or extending a abstract class that you dont plan to use at all.
 * 
 */
export function $unimplemented(msg="not implemented"): never {
  throw msg;
}


/**
 * Indicates unreachable code by panicking with a message of "following code is unreachable."
 * 
 * This allows your code to type-check, which is useful if you're prototyping or extending a abstract class that you dont plan to use at all.
 * 
 */
export function $unreachable(msg="following code is unreachable.") {
  $panic(msg);
}


export function $builtin(msg="This functionality was meant to be provided by the runtime.") {
  throw `${msg}\nBug-report: https://github.com/rusty-deno/std-rs.git`;
}
