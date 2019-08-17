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
      var barRatio = frameRect.height / contentRect.height;
      var scrollDelta = (frameRect.top - contentRect.top) * barRatio;

      updateScrollbar.bind(this.scrollBar)(scrollDelta, barRatio * 100);
      setScrollBarTimeout.bind({
        scrollBar: this.scrollBar,
        scrollBarTimeout: this.scrollBarTimeout
      })(1500);
    }.bind({ scrollable, frame, content, scrollBarTimeout, scrollBar })
  );
}

function updateScrollbar(offSet, length) {
  this.style.top = offSet + "px";
  this.style.height = length + "%";
}

function setScrollBarTimeout(timeout) {
  if (this.scrollBar.className === "scroll-bar scrolling") {
    clearTimeout(this.scrollBarTimeout);
  } else {
    this.scrollBar.classList.add("scrolling");
  }
  this.scrollBarTimeout = setTimeout(
    function() {
      this.classList.remove("scrolling");
    }.bind(this.scrollBar),
    timeout
  );
}
