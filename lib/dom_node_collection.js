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
