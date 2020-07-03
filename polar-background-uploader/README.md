# polar-background-uploader

This package allows the user to upload small amounts of data (up to say 10MB) 
but use a local URL while it's being uploaded. 

Once it's uploaded, the key is no longer kept in localStorage and the key can
be used to resolve the *real* URL in whatever backend system is needed.

Data is kept in localStorage and must be represented as a URL.  While in 
localStorage we just use a data URL.

