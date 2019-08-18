import Scrollable from "./scrollable.js";

var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var temp = new Scrollable({
    el: scrollable
  });
  temp.onScroll();
}
