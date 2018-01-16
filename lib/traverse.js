/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const DOMNodeCollection = __webpack_require__(2);

const readyFunctions = [];

const $t = (arg) => {

  switch (typeof arg) {
    case ('string'):
      let selection = Array.from(document.querySelectorAll(arg));
      return new DOMNodeCollection(selection);
    //if HTMLElement, create DOMNodeCollection
    case ('object'):
      if (arg instanceof HTMLElement) {
        return new DOMNodeCollection([arg]);
      }
      return null;
    case ('function'):
      switch (document.readyState) {
        case "loading":
          readyFunctions.push(arg);
          return null;
        case "interactive":
        case "complete":
          arg.call();
      }
      return null;
    default:
      return null;
  }
};

$t.extend = (obj1, ...objs) => {
  objs.forEach( (obj) => {
    Object.values(obj).forEach( (objVal) => obj1[objVal] = objVal);
  });
  return obj1;
};

$t.ajax = (options) => {
  
};


window.addEventListener("DOMContentLoaded", () => {
  readyFunctions.forEach( (fn) => fn() );
});

window.$t = $t;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

class DOMNodeCollection {

  constructor(elements) {
    this.elements = elements;
  }

  html(string) {
    if (string) {
      this.elements.forEach( (el) => {
        el.innerHTML = string;
      });
    } else {
      return this.elements[0].innerHTML;
    }
  }

  empty() {
    this.elements.forEach( (el, idx) => {
      this.elements[idx].innerHTML = "";
    });
  }

  append(args) {
      if (typeof args === 'object') {
        if (args instanceof DOMNodeCollection) {
          //expect that args is a DOMNodeCollection-wrapped item(s)
          Object.values(args)[0].forEach( (arrayItem) => {
            this.elements.forEach( (el, idx) => {
              this.elements[idx].innerHTML += arrayItem.outerHTML;
            });
          });

        } else {
          //expect that args is an HTMLElement
          this.elements.forEach( (el, idx) => {
            this.elements[idx].innerHTML += args.outerHTML;
          });
        }
      }

      if (typeof args === 'string') {
        //expect that we want to append text
        this.elements.forEach( (el, idx) => {
          this.elements[idx].innerHTML += argEl;
        });
      }
  }

  addClass(className) {
    // get classList for each el then add new arg
    this.elements.forEach( (el, idx) => {
      let elClassList = el.classList;
      elClassList.add(className);
    });
  }

  removeClass(className) {
    // get classList for each el then remove  arg
    this.elements.forEach( (el, idx) => {
      let elClassList = el.classList;
      elClassList.remove(className);
    });
  }

  attr(attrName, newAttrVal) {
    //if no new val, assume user wants current val
    if (newAttrVal === undefined) {
      let els = this.elements;
      els = els.map( (el) => {
        return el.getAttribute(attrName);
      });
    } else {
      //if new val, change attrs to new val
      this.elements.forEach( (el, idx) => {
        if ((newAttrVal !== false) && (newAttrVal !== null)) {
          this.elements[idx].setAttribute(attrName, newAttrVal);
        } else {
          this.elements[idx].removeAttribute(attrName);
        }
      });
    }
  }

  children() {
    //returns all child elements anywhere in the element collection
    let children = [];

    const getChildren = (arr) => {
      arr.forEach( (el) => {
        let elChildren = Array.from(el.children);
        if (elChildren.length > 0) {
          children = children.concat(elChildren);
          getChildren(elChildren);
        } else {
        }
      });
    };
    getChildren(this.elements);
    return new DOMNodeCollection(children);
  }

  parent() {
    //returns the parent element for the element collection, skipping dupes
    let parents = [];

    const getParent = (arr) => {
      arr.forEach( (el) => {
        let parentEl = el.parentElement;
        if (!parents.includes(parentEl) ) {
          parents.push(parentEl);
        }
      });
    };

    getParent(this.elements);

    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let selected = [];

    this.elements.forEach( (el) => {
      selected = selected.concat( Array.from(el.querySelectorAll(selector)) );
    });

    return new DOMNodeCollection(selected);
  }

  remove() {
    this.elements.forEach( (el, idx) => {
      this.elements[idx].outerHTML = "";
    });
  }

  on(eventType, callback) {
    this.elements.forEach( (el) => {
      el[eventType] = callback;
      el.addEventListener(eventType, callback);
    });
  }

  off(eventType) {
    this.elements.forEach( (el) => {
      el.removeEventListener(eventType, el[eventType]);
    });
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
//# sourceMappingURL=traverse.js.map