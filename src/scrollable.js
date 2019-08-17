var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var frame = scrollable.getElementsByClassName("scroll-frame")[0];
  var content = scrollable.getElementsByClassName("scroll-content")[0];
  var scrollbarX = createClassElement("div", "scrollbar scrollbar-x");
  scrollbarX.style.left = "0px";
  var scrollbarY = createClassElement("div", "scrollbar scrollbar-y");
  scrollbarY.style.top = "0px";
  scrollable.append(scrollbarX);
  scrollable.append(scrollbarY);
  var scrollBarTimeoutX;
  var scrollBarTimeoutY = 1;

  frame.addEventListener(
    "scroll",
    function(e) {
      var state = getScrollbarState.call({
        frame: this.frame,
        content: this.content
      });

      if (state.length.x < 100) {
        updateScrollbarX.call(
          { scrollbar: this.scrollbarX },
          state.offSet.x,
          state.length.x
        );
        this.scrollBarTimeoutX = setScrollbarTimeout.call(
          {
            scrollbar: this.scrollbarX,
            scrollBarTimeout: this.scrollBarTimeoutX
          },
          3000
        );
      }

      if (state.length.y < 100) {
        updateScrollbar.call(
          { scrollbar: this.scrollbarY },
          state.offSet.y,
          state.length.y
        );
        this.scrollBarTimeoutY = setScrollbarTimeout.call(
          {
            scrollbar: this.scrollbarY,
            scrollBarTimeout: this.scrollBarTimeoutY
          },
          3000
        );
      }
    }.bind({
      scrollable,
      frame,
      content,
      scrollbarX,
      scrollbarY,
      scrollBarTimeoutX,
      scrollBarTimeoutY
    })
  );
}

function createClassElement(tag, className) {
  var el = document.createElement(tag);
  el.className = className;
  return el;
}

function getScrollbarState() {
  var frameRect = this.frame.getBoundingClientRect();
  var contentRect = this.content.getBoundingClientRect();
  var lengthRatio = {
    x: frameRect.width / contentRect.width,
    y: frameRect.height / contentRect.height
  };
  var offSet = {
    x: Math.round((frameRect.left - contentRect.left) * lengthRatio.x),
    y: Math.round((frameRect.top - contentRect.top) * lengthRatio.y)
  };
  var length = {
    x: Math.round(lengthRatio.x * 100),
    y: Math.round(lengthRatio.y * 100)
  };
  return { offSet, length };
}

function updateScrollbarX(offSet, length) {
  if (parseInt(this.scrollbar.style.left, 10) !== offSet) {
    this.scrollbar.style.left = offSet + "px";
    this.scrollbar.classList.add("scrolling");
  }
  if (this.scrollbar.style.width !== length + "%") {
    this.scrollbar.style.width = length + "%";
  }
}

function updateScrollbar(offSet, length) {
  if (parseInt(this.scrollbar.style.top, 10) !== offSet) {
    this.scrollbar.style.top = offSet + "px";
    this.scrollbar.classList.add("scrolling");
  }
  if (this.scrollbar.style.height !== length + "%") {
    this.scrollbar.style.height = length + "%";
  }
}

function setScrollbarTimeout(timeout) {
  if (this.scrollbar.classList.contains("scrolling")) {
    clearTimeout(this.scrollBarTimeout);
  }
  return setTimeout(
    function() {
      this.classList.remove("scrolling");
    }.bind(this.scrollbar),
    timeout
  );
}
