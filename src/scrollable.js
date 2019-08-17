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
      var state = getScrollbarState.call({
        frame: this.frame,
        content: this.content
      });
      updateScrollbar.call(this.scrollBar, state.offSet, state.length);
      setScrollbarTimeout.call(
        {
          scrollBar: this.scrollBar,
          scrollBarTimeout: this.scrollBarTimeout
        },
        1500
      );
    }.bind({ scrollable, frame, content, scrollBarTimeout, scrollBar })
  );
}

function getScrollbarState() {
  var frameRect = this.frame.getBoundingClientRect();
  var contentRect = this.content.getBoundingClientRect();
  var barRatio = frameRect.height / contentRect.height;
  var scrollDelta = (frameRect.top - contentRect.top) * barRatio;
  return { offSet: scrollDelta, length: barRatio * 100 };
}

function updateScrollbar(offSet, length) {
  this.style.top = offSet + "px";
  this.style.height = length + "%";
}

function setScrollbarTimeout(timeout) {
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
