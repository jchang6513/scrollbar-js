var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var frame = scrollable.getElementsByClassName("scroll-frame")[0];
  var content = scrollable.getElementsByClassName("scroll-content")[0];
  var scrollBarTimeout;
  var scrollBar = document.createElement("div");
  scrollBar.className = "scroll-bar";
  scrollable.append(scrollBar);

  frame.addEventListener(
    "scroll",
    function(e) {
      var frameRect = this.frame.getBoundingClientRect();
      var contentRect = this.content.getBoundingClientRect();
      var scrollDelta = frameRect.top - contentRect.top;
      var barRatio = (frameRect.height / contentRect.height) * 100;

      this.scrollBar.style.top = scrollDelta + "px";
      this.scrollBar.style.height = barRatio + "%";

      if (this.scrollBar.className === "scroll-bar scrolling") {
        clearTimeout(this.scrollBarTimeout);
      } else {
        this.scrollBar.className = "scroll-bar scrolling";
      }
      this.scrollBarTimeout = setTimeout(
        function() {
          this.className = "scroll-bar";
        }.bind(this.scrollBar),
        1500
      );
    }.bind({ scrollable, frame, content, scrollBarTimeout, scrollBar })
  );
}
