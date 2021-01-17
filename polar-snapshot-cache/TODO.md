- for query snapshots, we have to write a record for each document so that we can fetch them faster.
- TODO:
    - maybe query snapshots aren't actually materialized... 
    
- TODO, we can avoid cache set issues by comparing the objects and only writing
  to the cache once we know they have changed. setMulti is slow and indexes have
  to be updated etc so if objects haven't changed don't actually write them.
   
- TODO: build a cache hit/miss calculator to keep track of how fast/slow things are running

    - TODO: we will need a deepEquals function for this because we will need to 'get' the current
      value first
      
      
    - 