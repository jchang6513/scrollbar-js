var Direction = {
  Horizontal: "horizontal",
  Vertical: "vertical"
};

var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var frame = scrollable.getElementsByClassName("scroll-frame")[0];
  var content = scrollable.getElementsByClassName("scroll-content")[0];
  var scrollbarX = createScrollBar(Direction.Horizontal);
  var scrollbarY = createScrollBar(Direction.Vertical);
  scrollable.append(scrollbarX);
  scrollable.append(scrollbarY);
  var scrollBarTimeoutX;
  var scrollBarTimeoutY;

  frame.addEventListener(
    "scroll",
    function() {
      var state = getScrollbarState.call({
        frame: this.frame,
        content: this.content
      });
      updateScrollbars.call(this, state.offSet, state.length);
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

function createScrollBar(type) {
  var scrollbar = createClassElement("div", "scrollbar");
  switch (type) {
    case Direction.Horizontal: {
      scrollbar.classList.add("scrollbar-x");
      scrollbar.style.left = "0px";
      return scrollbar;
    }
    case Direction.Vertical: {
      scrollbar.classList.add("scrollbar-y");
      scrollbar.style.top = "0px";
      return scrollbar;
    }
    default:
      return null;
  }
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

function updateScrollbars(offset, length) {
  if (length.x < 100) {
    updateScrollbarX.call(
      {
        scrollbar: this.scrollbarX,
        scrollBarTimeout: this.scrollBarTimeoutX
      },
      offset.x,
      length.x
    );
  }
  if (length.y < 100) {
    updateScrollbarY.call(
      {
        scrollbar: this.scrollbarY,
        scrollBarTimeout: this.scrollBarTimeoutY
      },
      offset.y,
      length.y
    );
  }
}

function updateScrollbarX(offset, length) {
  if (offset >= 0 && getStyleLeft(this.scrollbar) !== offset) {
    setStyleLeft(this.scrollbar, offset);
    this.scrollbar.classList.add("scrolling");
  }
  if (length && getStyleWidth(this.scrollbar) !== length) {
    setStyleWidth(this.scrollbar, length);
  }
  setScrollbarTimeout.call(this, 1500);
}

function updateScrollbarY(offset, length) {
  if (offset >= 0 && getStyleTop(this.scrollbar) !== offset) {
    setStyleTop(this.scrollbar, offset);
    this.scrollbar.classList.add("scrolling");
  }
  if (getStyleHeight(this.scrollbar) !== length) {
    setStyleHeight(this.scrollbar, length);
  }
  setScrollbarTimeout.call(this, 1500);
}

function setScrollbarTimeout(timeout) {
  if (this.scrollbar.classList.contains("scrolling")) {
    clearTimeout(this.scrollBarTimeout);
  }
  this.scrollBarTimeout = setTimeout(
    function() {
      this.classList.remove("scrolling");
    }.bind(this.scrollbar),
    timeout
  );
}

// getter and setter

function getStyleTop(el) {
  return parseInt(el.style.top, 10);
}

function setStyleTop(el, top) {
  el.style.top = top + "px";
}

function getStyleLeft(el) {
  return parseInt(el.style.left, 10);
}

function setStyleLeft(el, left) {
  el.style.left = left + "px";
}

function getStyleWidth(el) {
  return parseInt(el.style.width, 10);
}

function setStyleWidth(el, length) {
  el.style.width = length + "%";
}

function getStyleHeight(el) {
  return parseInt(el.style.height, 10);
}

function setStyleHeight(el, length) {
  el.style.height = length + "%";
}
