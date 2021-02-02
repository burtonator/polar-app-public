- for query snapshots, we have to write a record for each document so that we can fetch them faster.
- TODO:
    - maybe query snapshots aren't actually materialized but we store them as as
      document pointers ... and commit out the results.
    
- TODO, we can avoid cache set issues by comparing the objects and only writing
  to the cache once we know they have changed. setMulti is slow and indexes have
  to be updated etc so if objects haven't changed don't actually write them.
   
- TODO: build a cache hit/miss calculator to keep track of how fast/slow things are running

    - TODO: we will need a deepEquals function for this because we will need to 'get' the current
      value first
      
      
    - 

- TODO: add a timing systme for all async operations in Firestore so that we can
  wrap the driver to know what's slow and what is fast.


- TODO !!!!!

    - if the SERVER data comes first, allow that snapshot to come first and
      ignore the cache data... 
      
    - DO NOT wait for the cache to be updated to return to the client... 

    - FIXME  the other issue is uploading data agian when we come back online... we have to resync... 
    
    - we will need some sort of -sync-to-server code... to upload when we resume.
    
    - when we get new snapshots I do not think we properly remove items for the cache... 
    
    
    - FIXME: I need the ablity to get updates from the cache when a writer writes to the cache and a reader 
      is listening.
      
    - FIXME 
    
        https://stackoverflow.com/questions/33237863/get-notified-when-indexeddb-entry-gets-changed-in-other-tab
        
        https://github.com/w3c/IndexedDB/issues/51
        
    - FIXME: shit... there is no way to synchronize/communicate between the two windows unless I impelment somthign 
      custom


    - FIXME: https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
    
    
    - https://caniuse.com/broadcastchannel
    
    - FIXME: I'm not sure what we're going to do about multiple readers/writers
      to the same store and how they're going to coordinate listerns.

    - FIXME: without a centralized coordinator, I'm going to be using 2x more data too!..


    - FIXME: actually MEASURE the dureation of each snapshot... with teh cache being used.  

        - FIXME: The indexedDB lock isn't held long... 

    - I could go without coordinating the store... if I used something like serial numbers for the records.. 
      

- https://www.youtube.com/watch?v=oDvdAFP6OhQ

    - Firestore writes all writes to a log, and applies all the writes to reads...
    
       https://youtu.be/oDvdAFP6OhQ?t=326

    - Last writer always wins...  this is an easy strategy to implement.
    
        https://youtu.be/oDvdAFP6OhQ?t=375
        
    - if you includeMetadata changes Firestore can't de-duplicate the JSON and you get two events but it you
      remove this you get fewer events but no ability to know where the data came from.
    
        https://youtu.be/oDvdAFP6OhQ?t=575
        
    - the BIGGEST issues are snapshots that don't fire because they don't see the cache being updated.
    
    - Transactions fail when we are offline???? 
        - https://youtu.be/oDvdAFP6OhQ?t=741
        - batch writes don't have this issue! 

    - so the two main issues I have are:
        
        - I need to distribute metadata for cache writes to all open tabs via some type of channel
        - 


    - this is a polyfill for broadcast channel that might work
    
        https://github.com/arnellebalane/hermes
        https://blog.arnellebalane.com/sending-data-across-different-browser-tabs-6225daac93ec
        
        https://www.npmjs.com/package/broadcast-channel
        https://www.npmjs.com/package/broadcastchannel-polyfill


@burtonator Firestore uses "last write wins" for its conflict resolution - but the winning write is the last write that is sent to the backend, not necessarily the last write that occurred on an (offline) device. Offline devices replay their edits when they gain back connectivity and can therefore replace edits that were made by other devices.

Please take a look here for some mitigation strategies: https://stackoverflow.com/questions/51083190/firestore-what-happens-when-an-offline-device-goes-online

