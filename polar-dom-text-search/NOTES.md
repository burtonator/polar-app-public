- innerText always returns the right representation for the nodes in the DOM

- whitespace always compresses to one whitespace character in the UI.  The values 
  are stored IN the DOM but not shown in a redundant manner in the UI.
  
    - this applies to multiple spans with individual spaces in it or \r or \n
      even nesting applies too
  
