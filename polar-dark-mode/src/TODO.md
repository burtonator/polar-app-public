-- the react-select dropdown colors are wrong (for light)
-- add custom work for the canvas:
-- input needs to be done with slightly lighter colors
    --same thing for the react-table nav at the bottom.
-- charts are still broken
-- primary selected color is broken
-- placing the cursor in a text are is broken
-- font is wrong...
 - context menu mouse over
 - button bar colors in doc menu are too light


```css    
    canvas {
        filter: invert(0.85);
    }
    
    .pdfViewer .page {
        -o-border-image: none;
        border-image: none;
    }
```
