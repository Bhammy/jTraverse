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
/***/ (function(module, exports, __webpack_require__) {

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
    Object.keys(obj).forEach( (objKey) => {
      obj1[objKey] = obj[objKey];
    });
  });
  return obj1;
};

$t.ajax = (options) => {
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    data: {},
    success: () => {},
    error: () => {},
  };
  let vals = $t.extend(defaults, options);

  const xhr = new XMLHttpRequest();

  xhr.open(vals.method, vals.url);

  xhr.onload = (ev) => {
    if (xhr.status === 200) {
      vals.success(JSON.parse(xhr.response));
    } else {
      vals.error(JSON.parse(xhr.response));
    }
  };

  xhr.send(vals.data);

};

window.addEventListener("DOMContentLoaded", () => {
  readyFunctions.forEach( (fn) => fn() );
  $t('span').elements.forEach( (cell) => {
    $t(cell).on("click", (e) => {

      toggleClick(e, cell);
    });
  });

  let inputsArray = $t('.slider').elements;

  inputsArray.slice(0,4).forEach( (input, idx) => {
    $t(input).on("input", (e) => {
      $t(`.row-${idx + 1}`).elements.forEach( (el) => {
        el.style.height = `${e.currentTarget.value}px`;
      });
    });
  });

  inputsArray.slice(4,8).forEach( (input, idx) => {
    $t(input).on("input", (e) => {
      $t(`.col-${idx + 1}`).elements.forEach( (el) => {
        el.style.width = `${e.currentTarget.value}px`;
      });
    });
  });

  $t('#size-reset').on("click", (e) => {
    $t('span').elements.forEach( (el) => {
      el.style.width = `100px`;
      el.style.height = `100px`;
    });
    $t('.slider').elements.forEach( (el) => {
      el.value = 100;
    });
  });

  $t("#color-cycle").on("click", (e) => {
    let spans = $t('span');
    toggleCellColorCycle(spans);
  });

  $t("#color-cycle-stop").on("click", (e) => {
    let spans = $t('span');
    spans.elements.forEach( (span) => {
      clearInterval(span.clearInt);
      delete span.clearInt;
    });
  });

  $t("#color-reset").on("click", (e) => {
    $t(".row-1").elements.forEach( (span) => {
      span.style.backgroundColor="rgba(174, 216, 230, 1.0)";
    });
    $t(".row-2").elements.forEach( (span) => {
      span.style.backgroundColor="rgba(148, 242, 144, 1.0)";
    });
    $t(".row-3").elements.forEach( (span) => {
      span.style.backgroundColor="rgba(255, 255, 10, 1.0)";
    });
    $t(".row-4").elements.forEach( (span) => {
      span.style.backgroundColor="rgba(253, 165, 7, 1.0)";
    });
  });

  $t("#weather-button").on("click", (e) => {
    e.preventDefault();
    getWeather($t("#city-input").value(), $t("#country-input").value());
  });

  $t("#translate-button").on("click", (e) => {
    e.preventDefault();
    getHuttese($t("#to-translate").value());
  });

});

window.$t = $t;

function toggleClick (e, cell) {
  if (Array.from(e.currentTarget.classList).includes("clicked") === true) {
    $t(cell).removeClass("clicked");
 } else {
   $t('span').removeClass('clicked');
   $t(cell).addClass("clicked");
   updateValue(e, cell);
 }
}

function updateValue(e, cell) {
  $t("#cell-val").html(`${$t(cell).html()}`);
}

function toggleCellColorCycle(spans) {
  spans.elements.forEach( (span) => {
    span.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
    if (!span.clearInt) {
      span.clearInt = setInterval( cycleCellColor, 1000, span);
    }
  });
}

function cycleCellColor(span) {
  span.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
}

function getWeather(city, country) {
  $t.ajax({
      type: 'GET',
      url: `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=bcb83c4b54aee8418983c2aff3073b3b`,
      success(data) {
        $t(".hutt-img").remove();
        $t(".return-data").removeClass("hidden");
        console.log(data);
        $t(".return-data-content").html(`The weather in ${data.name}: ${data.weather[0].description}.`);
      },
      error() {
        console.log("oops");
      },
   });
}

function getHuttese(text) {
  // error code below for demos in case of too many server requests
  $t.ajax({
      type: 'GET',
      url: `http://api.funtranslations.com/translate/huttese.json?text=${text}`,
      success(data) {
        $t(".return-data").removeClass("hidden");
        let img = new Image();
        img.src = "./assets/jabba.png";
        img.style.height="200px";
        img.style.width="auto";
        $t(".hutt-li").append(img);
        $t("img").addClass("hutt-img");
        $t(".return-data-content").html(`${data.contents.translated}`);
      },
      error() {
        let img = new Image();
        img.src = "./assets/jabba.png";
        img.style.height="200px";
        img.style.width="auto";
        $t(".hutt-li").append(img);
        $t("img").addClass("hutt-img");
        $t(".return-data").removeClass("hidden");
        $t(".return-data-content").append("GOCHUUTA, SOLO. HUU HUU HUU");
      },
   });
}

window.getHuttese = getHuttese;


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
          this.elements[idx].innerHTML += args;
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
      return els;
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

  value() {
    let vals = [];
    this.elements.forEach( (el) => {
      vals.push(el.value);
    });
    return (vals.length > 1) ? vals : vals[0];
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);
//# sourceMappingURL=traverse.js.map