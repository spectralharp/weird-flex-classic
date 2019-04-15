//
//
//
//
//

(function() {

  window.addEventListener("load", initialize);

  function initialize() {
    $("container-input").addEventListener("input", updateContainer);
    setupCollapse();
    setupValueButtons();
    updateContainer();
    updateAxis();
  }

  function updateContainer() {
    $("container-style").innerText = "#boxes-container {" + $("container-input").value + "}";
    updateAxis();
  }

  function updateAxis() {
    switch (window.getComputedStyle($("boxes-container")).flexDirection) {
      case "row-reverse":
        setAxis("horizontal", "arrow-head-left", "", "main axis", "red");
        setAxis("vertical", "", "arrow-head-down", "cross axis", "blue");
        break;
      case "column":
        setAxis("horizontal", "", "arrow-head-right", "cross axis", "blue");
        setAxis("vertical", "", "arrow-head-down", "main axis", "red");
        break;
      case "column-reverse":
        setAxis("horizontal", "", "arrow-head-right", "cross axis", "blue");
        setAxis("vertical", "arrow-head-up", "", "main axis", "red");
        break;
      default:
        setAxis("horizontal", "", "arrow-head-right", "main axis", "red");
        setAxis("vertical", "", "arrow-head-down", "cross axis", "blue");
    }
  }

  function setAxis(axis, first, last, axisLabel, color) {
    $(axis).firstElementChild.className = first;
    $(axis).lastElementChild.className = last;
    $(axis).className = "";
    $(axis).querySelector("span").innerText = axisLabel;
    $(axis).classList.add(color);
  }

  function setupCollapse() {
    let coll = document.querySelectorAll(".collapse");
    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", toggleCollapse);
    }
  }

  function setupValueButtons() {
   let btns = document.querySelectorAll(".value-btn");
   for (let i = 0; i < btns.length; i++) {
     btns[i].addEventListener("click", addProperty);
   }
  }

  function toggleCollapse() {
    let content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  }

  function addProperty() {
    let propertyRegex = new RegExp(`(${this.parentElement.dataset["property"]} *: *)[\\w-]*`);
    if(propertyRegex.test($("container-input").value)) {
      $("container-input").value = $("container-input").value.replace(propertyRegex, `$1${this.innerText}`);
    } else {
      $("container-input").value += "\n" + this.parentElement.dataset["property"] + ": " + this.innerText + ";";
    }
    updateContainer();
  }

  function $(id) {
    return document.getElementById(id);
  }

  /*function toggleTheme(){
    document.querySelector("link").href = this.checked ? DARK_THEME : LIGHT_THEME;
  }*/
})();
