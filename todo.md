
# FIX:
  Thread
  Option,Result pretty print
  Async Eq
  circular import

# Remaster
  errors,
  Add rust implementation for HashMap and HashSet
  Improve HashTable empty algo

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
  # trait
    Joinable
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
