var Direction = {
  Horizontal: "horizontal",
  Vertical: "vertical"
};

class Scrollable {
  constructor(el) {
    this.frame = el.getElementsByClassName("scroll-frame")[0];
    this.content = el.getElementsByClassName("scroll-content")[0];
    this.scrollbarX = this.createScrollBar(Direction.Horizontal);
    this.scrollbarY = this.createScrollBar(Direction.Vertical);
    el.append(this.scrollbarX);
    el.append(this.scrollbarY);
    this.scrollBarTimeoutX = 0;
    this.scrollBarTimeoutY = 0;
    this.timeout = 1500;
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

  updateScrollbars(offset, length) {
    if (length.x < 100) {
      this.updateScrollbarX(offset.x, length.x);
    }
    if (length.y < 100) {
      this.updateScrollbarY(offset.y, length.y);
    }
  }

  updateScrollbarX(offset, length) {
    if (offset >= 0 && getStyleLeft(this.scrollbarX) !== offset) {
      setStyleLeft(this.scrollbarX, offset);
      this.scrollbarX.classList.add("scrolling");
    }
    if (length && getStyleWidth(this.scrollbarX) !== length) {
      setStyleWidth(this.scrollbarX, length);
    }
    this.scrollBarTimeoutX = this.setScrollbarTimeout.call(
      {
        scrollbar: this.scrollbarX,
        scrollBarTimeout: this.scrollBarTimeoutX
      },
      this.timeout
    );
  }

  updateScrollbarY(offset, length) {
    if (offset >= 0 && getStyleTop(this.scrollbarY) !== offset) {
      setStyleTop(this.scrollbarY, offset);
      this.scrollbarY.classList.add("scrolling");
    }
    if (getStyleHeight(this.scrollbarY) !== length) {
      setStyleHeight(this.scrollbarY, length);
    }
    this.scrollBarTimeoutY = this.setScrollbarTimeout.call(
      {
        scrollbar: this.scrollbarY,
        scrollBarTimeout: this.scrollBarTimeoutY
      },
      this.timeout
    );
  }

  setScrollbarTimeout(timeout) {
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

var scrollables = document.getElementsByClassName("scrollable");
var scrollableKeys = Object.keys(scrollables);

for (var i = 0; i < scrollableKeys.length; i++) {
  var scrollable = scrollables[scrollableKeys[i]];
  var temp = new Scrollable(scrollable);
  temp.onScroll();
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
