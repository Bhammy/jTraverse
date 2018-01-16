const DOMNodeCollection = require('./dom_node_collection');


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
      vals.success(xhr.response);
    } else {
      vals.error(xhr.response);
    }
  };
  xhr.send(vals.data);
};


window.addEventListener("DOMContentLoaded", () => {
  readyFunctions.forEach( (fn) => fn() );
});

window.$t = $t;
