//
//
//

"use strict";
(function() {

  window.addEventListener("load", initialize);

  function initialize() {
    $("container-input").addEventListener("input", updateContainer);
    $("item-input").addEventListener("input", updateItem);
    setupCollapse();
    setupValueButtons();
    setupBoxes();
    updateContainer();
    updateAxis();
  }

  function updateContainer() {
    $("container-style").innerText = "#boxes-container {" + $("container-input").value + "}";
    updateAxis();
  }

  function updateItem() {
    $("item-style").innerText = ".selected {" + $("item-input").value + "}";
  }

  function updateAxis() {
    let wrap = window.getComputedStyle($("boxes-container")).flexWrap;
    switch (window.getComputedStyle($("boxes-container")).flexDirection) {
      case "row-reverse":
        setAxis("horizontal", "arrow-head-left", "", "main axis", "red");
        if(wrap !== "wrap-reverse") {
          setAxis("vertical", "", "arrow-head-down", "cross axis", "blue");
        } else {
          setAxis("vertical", "arrow-head-up", "", "cross axis", "blue");
        }
        break;
      case "column":
        if(wrap !== "wrap-reverse") {
          setAxis("horizontal", "", "arrow-head-right", "cross axis", "blue");
        } else {
          setAxis("horizontal", "arrow-head-left", "", "cross axis", "blue");
        }
        setAxis("vertical", "", "arrow-head-down", "main axis", "red");
        break;
      case "column-reverse":
        if(wrap !== "wrap-reverse") {
          setAxis("horizontal", "", "arrow-head-right", "cross axis", "blue");
        } else {
          setAxis("horizontal", "arrow-head-left", "", "cross axis", "blue");
        }
        setAxis("vertical", "arrow-head-up", "", "main axis", "red");
        break;
      default:
        setAxis("horizontal", "", "arrow-head-right", "main axis", "red");
        if(wrap !== "wrap-reverse") {
          setAxis("vertical", "", "arrow-head-down", "cross axis", "blue");
        } else {
          setAxis("vertical", "arrow-head-up", "", "cross axis", "blue");
        }
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

  function setupBoxes() {
    let boxes = document.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener("click", toggleSelect);
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

  function toggleSelect() {
    this.classList.toggle("selected");
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
})();
