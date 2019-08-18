var Direction = {
  Horizontal: "horizontal",
  Vertical: "vertical"
};

export default class Scrollable {
  constructor(el) {
    this.scrollable = el;
    this.frame = this.scrollable.getElementsByClassName("scroll-frame")[0];
    this.frameRect = this.frame.getBoundingClientRect();
    this.content = this.scrollable.getElementsByClassName("scroll-content")[0];
    this.contentRect = this.content.getBoundingClientRect();
    this.addScrollBars();
    this.timeout = 3000;
  }

  addScrollBars() {
    this.scrollbarX = {
      el: this.createScrollBar(Direction.Horizontal),
      timeout: 0
    };
    this.scrollbarY = {
      el: this.createScrollBar(Direction.Vertical),
      timeout: 0
    };
    this.scrollable.append(this.scrollbarX.el);
    this.scrollable.append(this.scrollbarY.el);
  }

  createScrollBar(type) {
    var scrollbar = this.createClassElement("div", "scrollbar");
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

  createClassElement(tag, className) {
    var el = document.createElement(tag);
    el.className = className;
    return el;
  }

  getScrollbarState() {
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

  updateRects() {
    this.frameRect = this.frame.getBoundingClientRect();
    this.contentRect = this.content.getBoundingClientRect();
  }

  getScrollbarXState() {
    var lengthRatio = this.frameRect.width / this.contentRect.width;
    var offset = Math.round(
      (this.frameRect.left - this.contentRect.left) * lengthRatio
    );
    var length = Math.round(lengthRatio * 100);
    return { offset, length };
  }

  getScrollbarYState() {
    var lengthRatio = this.frameRect.height / this.contentRect.height;
    var offset = Math.round(
      (this.frameRect.top - this.contentRect.top) * lengthRatio
    );
    var length = Math.round(lengthRatio * 100);
    return { offset, length };
  }

  updateScrollbars(offset, length) {
    this.updateRects();
    this.updateScrollbarX(offset.x, length.x);
    this.updateScrollbarY();
  }

  updateScrollbarX() {
    var state = this.getScrollbarXState();
    var offset = state.offset;
    var length = state.length;
    if (getStyleLeft(this.scrollbarX.el) !== offset) {
      this.setScrollbarTimeout.call(
        { scrollbar: this.scrollbarX },
        this.timeout
      );
    }
    setStyleLeft(this.scrollbarX.el, offset);
    setStyleWidth(this.scrollbarX.el, length);
  }

  updateScrollbarY() {
    var state = this.getScrollbarYState();
    var offset = state.offset;
    var length = state.length;
    if (getStyleTop(this.scrollbarY.el) !== offset) {
      this.setScrollbarTimeout.call(
        { scrollbar: this.scrollbarY },
        this.timeout
      );
    }
    setStyleTop(this.scrollbarY.el, offset);
    setStyleHeight(this.scrollbarY.el, length);
  }

  setScrollbarTimeout(timeout) {
    if (this.scrollbar.el.classList.contains("scrolling")) {
      clearTimeout(this.scrollbar.timeout);
    } else {
      this.scrollbar.el.classList.add("scrolling");
    }

    this.scrollbar.timeout = setTimeout(
      function() {
        this.classList.remove("scrolling");
      }.bind(this.scrollbar.el),
      timeout
    );
  }

  setTimout(timeout) {
    this.timeout = timeout;
  }

  onScroll() {
    this.frame.addEventListener(
      "scroll",
      function() {
        var state = this.getScrollbarState();
        this.updateScrollbars(state.offSet, state.length);
      }.bind(this)
    );
  }
}

// getter and setter

function getStyleTop(el) {
  return parseInt(el.style.top, 10);
}

function setStyleTop(el, top) {
  if (getStyleTop(el) !== top) {
    el.style.top = top + "px";
  }
}

function getStyleLeft(el) {
  return parseInt(el.style.left, 10);
}

function setStyleLeft(el, left) {
  if (getStyleLeft(el) !== left) {
    el.style.left = left + "px";
  }
}

function getStyleWidth(el) {
  return parseInt(el.style.width, 10);
}

function setStyleWidth(el, length) {
  if (getStyleWidth(el) !== length) {
    el.style.width = length + "%";
  }
}

function getStyleHeight(el) {
  return parseInt(el.style.height, 10);
}

function setStyleHeight(el, length) {
  if (getStyleHeight(el) !== length) {
    el.style.height = length + "%";
  }
}
