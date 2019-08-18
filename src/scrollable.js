const Direction = {
  Horizontal: "horizontal",
  Vertical: "vertical"
};

export default class Scrollable {
  constructor(props) {
    const { el, scrollbarX = true, scrollbarY = true } = props;
    this.state = {
      scrollbarX,
      scrollbarY
    };
    if (isElement(el)) {
      this.scrollable = el;
      this.frame = this.scrollable.getElementsByClassName("scroll-frame")[0];
      this.frameRect = this.frame.getBoundingClientRect();
      this.content = this.scrollable.getElementsByClassName(
        "scroll-content"
      )[0];
      this.contentRect = this.content.getBoundingClientRect();
      this.addScrollBars();
    } else {
      throw new Error("the input element is invalid");
    }
    this.timeout = 1500;
  }

  addScrollBars() {
    const { scrollable } = this;
    if (this.state.scrollbarX) {
      this.scrollbarX = {
        el: this.createScrollBar(Direction.Horizontal),
        timeout: 0
      };
      scrollable.append(this.scrollbarX.el);
    }
    if (this.state.scrollbarY) {
      this.scrollbarY = {
        el: this.createScrollBar(Direction.Vertical),
        timeout: 0
      };
      scrollable.append(this.scrollbarY.el);
    }
  }

  createScrollBar(type) {
    const scrollbar = this.createClassElement("div", "scrollbar");
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
    const el = document.createElement(tag);
    el.className = className;
    return el;
  }

  updateRects() {
    this.frameRect = this.frame.getBoundingClientRect();
    this.contentRect = this.content.getBoundingClientRect();
  }

  getScrollbarXState() {
    const { frameRect, contentRect } = this;
    const { width: fWidth, left: fLeft } = frameRect;
    const { width: cWidth, left: cLeft } = contentRect;
    const lengthRatio = fWidth / cWidth;
    const offset = Math.round((fLeft - cLeft) * lengthRatio);
    const length = Math.round(lengthRatio * 100);
    return { offset, length };
  }

  getScrollbarYState() {
    const { frameRect, contentRect } = this;
    const { height: fHeight, top: fTop } = frameRect;
    const { height: cHeight, top: cTop } = contentRect;
    const lengthRatio = fHeight / cHeight;
    const offset = Math.round((fTop - cTop) * lengthRatio);
    const length = Math.round(lengthRatio * 100);
    return { offset, length };
  }

  updateScrollbars() {
    if (this.state.scrollbarX) {
      this.updateScrollbarX();
    }
    if (this.state.scrollbarY) {
      this.updateScrollbarY();
    }
  }

  updateScrollbarX() {
    const { offset, length } = this.getScrollbarXState();
    const { scrollbarX, timeout } = this;
    const { el: scrollBarEl } = scrollbarX;
    if (getStyleLeft(scrollBarEl) !== offset) {
      this.setScrollbarTimeout.call(scrollbarX, timeout);
    }
    setStyleLeft(scrollBarEl, offset);
    setStyleWidth(scrollBarEl, length);
  }

  updateScrollbarY() {
    const { offset, length } = this.getScrollbarYState();
    const { scrollbarY, timeout } = this;
    const { el: scrollBarEl } = scrollbarY;
    if (getStyleTop(scrollBarEl) !== offset) {
      this.setScrollbarTimeout.call(scrollbarY, timeout);
    }
    setStyleTop(scrollBarEl, offset);
    setStyleHeight(scrollBarEl, length);
  }

  setScrollbarTimeout(timeout) {
    const { el } = this;
    el.classList.contains("scrolling")
      ? clearTimeout(this.timeout)
      : el.classList.add("scrolling");

    this.timeout = setTimeout(
      function() {
        this.classList.remove("scrolling");
      }.bind(el),
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
        this.updateRects();
        this.updateScrollbars();
      }.bind(this)
    );
  }
}

//Returns true if it is a DOM node
function isNode(o) {
  return typeof Node === "object"
    ? o instanceof Node
    : o &&
        typeof o === "object" &&
        typeof o.nodeType === "number" &&
        typeof o.nodeName === "string";
}

//Returns true if it is a DOM element
function isElement(o) {
  return typeof HTMLElement === "object"
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === "object" &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === "string";
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
