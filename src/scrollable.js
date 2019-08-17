var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var frame = scrollable.getElementsByClassName("scroll-frame")[0];
  frame.addEventListener(
    "scroll",
    function(e, scrollable) {
      console.log(scrollable);
      var frame = this.getElementsByClassName("scroll-frame")[0];
      var content = this.getElementsByClassName("scroll-content")[0];
      var frameRect = frame.getBoundingClientRect();
      var contentRect = content.getBoundingClientRect();
      var scrollDelta = frameRect.top - contentRect.top;
      var barRatio = (frameRect.height / contentRect.height) * 100;
      console.log(scrollDelta, barRatio);
      var scrollBar = this.getElementsByClassName("scroll-bar")[0];
      var barExist = !!scrollBar;
      if (!barExist) {
        scrollBar = document.createElement("div");
        scrollBar.className = "scroll-bar";
      }
      scrollBar.style.top = scrollDelta + "px";
      scrollBar.style.height = barRatio + "%";
      if (!barExist) {
        this.append(scrollBar);
      }
    }.bind(scrollable)
  );
}
