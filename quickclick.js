"use strict";

(function() {
  function QuickClick(root) {
    // Desktop browsers don't need QuickClick.
    if (window.ontouchend === undefined) return;
    // Chrome and Firefox with meta viewport and width=device-width
    // don't need QuickClick.
    var viewport = document.querySelector("meta[name=viewport]");
    if (viewport
        && /width=device-width/.test(viewport.content)
        && !/Mac OS X/.test(navigator.userAgent)) return;

    var hasTouchMove = false;

    root.addEventListener("touchmove", function(e) {
      hasTouchMove = true;
    });

    root.addEventListener("touchend", function(e) {
      e.preventDefault();
      if (!hasTouchMove) {
        if (isFocusNeeded(e.target)) e.target.focus();
        e.target.dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
      }
      hasTouchMove = false;
    }, false);
  }

  function isFocusNeeded(el) {
    switch (el.nodeName) {
    case "TEXTAREA":
    case "SELECT":
      return true;
    case "INPUT":
      switch (el.type) {
      case "button":
      case "checkbox":
      case "file":
      case "image":
      case "radio":
      case "submit":
        return false;
      }
      return !el.disabled && !el.readOnly;
    default:
      return false;
    }
  }

  // Support for CommonJS and global.
  if (module != null && exports != null) {
    module.exports = QuickClick;
  } else {
    window.QuickClick = QuickClick;
  }
})();
