- new design of the 'post' strategy.
    the user is given a CSRF code for every request.  A new one is given every 
    time they login.
    
    If an existing one exists, it's cleared.
    
    the csrf token maps to an uid and other metadata for that user.
    
    - when a user does a PUT it includs the csrf token, we fetch the UID for 
      that token, then we write the doc to storage, and write ten epub file.
      
    - the payload is just JSON 
    
    - FIXME: the BINARY data for the PDF/epub is a problem though... 
    
        - I could do TWO requests.  One is for the binary data... the other is
          for the JSON data and each is given a document id.
          
    - use the infra from DatastoreImportFileFunctions
    
        - FIXME: this can compute the storage file path
        - FIXME how do we write the DocMeta... 
        
    - then 
        polar-bookshelf/web/js/datastore/sharing/GroupDatastores.ts
        
        ... will import the doc into the datastore copy copying the data 
        between two endpoints
        
        
    - OR, just go through the normal Polar login flow, just within the chrome 
      extension... 
        
 - I might not need the identity permission
         
        


- The main browser doesn't have access to my secondary authentication tokens 
  under my main account. I don't like that.  It's not the end of the world 
  though.

- authentication credentials don't seem to be remembered
- I do NOT like the auth flow... it seems super slow.  

- TODO: before I continue

    - VERIFY 100% that I can properly login with a regular user/pass because
      if this isn't possible this entire solution wn't work.

- new design:

    - NO authentication in the chrome extension

    - generate a CSRF in the web app on signin that can be validated in the app

    - do POST of the data on the server? I don't like this.  I'd rather embed
      the firebase datastore in the client ... but if it's slightly more work
      I guess it's not the end of the world.

    -     

- Send a message to the content script as a daemon
    - create-preview...
    - send message to the popup to send the data to polar...
    - then open the final document in polar...
        - 
    - DONE: create an epub from the metadata including docMeta and send it to the server
        -
        - this is like a day...
    - connect to firebase with noInitialSnapshot
        - 2-3 hours
    - include image and HTML metadata in the epub.
        - 1 hour
