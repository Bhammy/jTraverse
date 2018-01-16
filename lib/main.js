
const $t = (arg) => {
  switch (typeof arg) {
    //if string, expect CSS selectors
    case 'string':
      let selection = document.querySelectorAll(arg);
      return Array.from(selection);
    default:
      return null;
  }
};

window.$t = $t;
