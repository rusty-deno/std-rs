
# FIX:
  Thread
  Option,Result pretty print
  Eq

# Remaaster
  errors,

# ADD:
  # modules
    io,
    time,
    str,
    sync,
  # iter
    # IteratorTrait
      next_chunk
      collect
# Docs:
  # thread
    park,unpark

# Feature
  # fs
    FsFile
      writeAll,
      readToEnd
  # Exceptions
    impl IteratorTrait for Option and Result
