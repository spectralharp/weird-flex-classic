//
//
//
//
//

(function() {

  window.addEventListener("load", initialize);

  function initialize() {
    $("container-input").addEventListener("input", updateContainer);
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

  function $(id) {
    return document.getElementById(id);
  }

  /*function toggleTheme(){
    document.querySelector("link").href = this.checked ? DARK_THEME : LIGHT_THEME;
  }*/
})();
