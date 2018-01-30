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

  let inputsArray = $t('input').elements;

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
    $t('input').elements.forEach( (el) => {
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
    span.clearInt = setInterval( cycleCellColor, 1000, span);
  });
}

function cycleCellColor(span) {
  span.style.backgroundColor = "#"+((1<<24)*Math.random()|0).toString(16);
}
