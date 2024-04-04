
# FIX:
  Thread
  Option,Result pretty print
  Async Eq

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
      collect
      vec methods and Eq impl
  # Arr
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
