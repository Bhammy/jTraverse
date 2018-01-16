const DOMNodeCollection = require('./dom_node_collection');

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
    default:
      return null;
  }
};

window.$t = $t;
