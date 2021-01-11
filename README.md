# fabricSnapper, snapping fabric objects

Allows center-snapping objects while objects dragging.
Inspired by online editors like Canva and Crello.

## Sample Usage

```
  var canvas = new fabric.Canvas('c');
  var settings = {fill: 'green', stroke: 'green'}; // optional
  var snapper = new fabricSnapper(this.canvas, settings);
```

## Todo
- [ ] Allow limiting snapping objects
- [ ] Add snapping to boundaries
- [ ] Dynamic axis size
- [ ] Create a codepen sample