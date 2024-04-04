
# FIX:
  Thread
  Option,Result pretty print

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
