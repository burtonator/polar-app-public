- DONE: get new windows to open up correctly with window.open in a new tab (and
  in the) browser too OR use new tabs API
  
- get anki sync to work

    this code fails:

    async function doAsync() {
        const response = await fetch('http://localhost:8765');
        const text = await response.text();
        console.log("Text: ", text);
    }
    
    doAsync().catch(err => console.error("Got error: " + err))
    


- test everything in the desktop app and make sure it works properly

- get updates system to work

    This is part of: 

        /Users/burton/projects/polar-app/packages/polar-bookshelf/web/js/updates/Updates.ts
    
    and UpdatesController but we don't need that part yet. 
   
