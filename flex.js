// Add interavtivity to the website through collapsables and applies
// styles in the textarea editors to the container and items on the right
// of the page.

(function() {
  "use strict";
  /* Add a function that is called when the window is loaded */
  window.addEventListener("load", initialize);

  /* ------------------------------------ Initialization ---------------------------------- */

  /**
   * Initializes event listeners, sets up container.
   */
  function initialize() {
    id("container-input").addEventListener("input", updateContainer);
    id("item-input").addEventListener("input", updateItem);
    id("boxes-container").addEventListener("dblclick", addBox);

    id("delete-drop").addEventListener("dragover", dragoverDeleteZone);
    id("delete-drop").addEventListener("dragleave", dragleaveDeleteZone);
    id("delete-drop").addEventListener("drop", deleteBox);

    setupCollapse();
    setupValueButtons();
    setupBoxes();
    updateContainer();
    updateAxis();
  }

  /* --------------------------------------- Box Drag ------------------------------------- */

  function setupBoxDrag(box) {
    box.addEventListener("drag", boxDrag);
    box.addEventListener("dragstart", boxDragStart);
    box.addEventListener("dragend", boxDragEnd);
  }

  function boxDrag(e) {
    console.log("Drag");
  }

  function boxDragStart(e) {
    this.style.opacity = 0;
    e.dataTransfer.setData("text", e.target.id);
  }

  function boxDragEnd(e) {
    this.style.opacity = 1;
  }

  function dragoverDeleteZone(e) {
    e.target.src = "image/trashcan_open.png";
    e.preventDefault();
  }

  function dragleaveDeleteZone(e) {
    e.target.src = "image/trashcan_close.png";
    e.preventDefault();
  }

  function deleteBox(e) {
    console.log("Drop");
    e.target.src = "image/trashcan_close.png";
    e.preventDefault();
    console.log(e.dataTransfer);
    let data = e.dataTransfer.getData("text");
    document.getElementById(data).remove();
    refreshBoxId();
  }

  function addBox() {
    let box = document.createElement("div");
    box.classList.add("box");
    box.draggable = true;
    box.innerText = id("boxes-container").childElementCount;
    box.addEventListener("click", toggleSelect);
    setupBoxDrag(box);
    id("boxes-container").appendChild(box);
    refreshBoxId();
  }

  function refreshBoxId() {
    let boxes = document.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerText = i;
      boxes[i].id = "box-" + i;
    }
  }

  /* ------------------------------------ Initialization ---------------------------------- */

  /**
   * Updates the style of the flex container with the CSS in container input
   */
  function updateContainer() {
    id("container-style").innerText = "#boxes-container {" + id("container-input").value + "}";
    updateAxis();
  }

  /**
   * Updates the style of the flex items with the CSS in the selected input
   */
  function updateItem() {
    id("item-style").innerText = ".selected {" + id("item-input").value + "}";
  }

  /**
   * Updates the axis around the box based on the flex-direction and flex-wrap applied
   */
  function updateAxis() {
    let container = id("boxes-container");
    let computedStyle = window.getComputedStyle(container);
    let normalWrap = computedStyle.flexWrap !== "wrap-reverse";
    switch (computedStyle.flexDirection) {
      case "column":
        setAxis("vertical", "", "arrow-head-down", true);
        if(normalWrap) {
          setAxis("horizontal", "", "arrow-head-right", false);
        } else {
          setAxis("horizontal", "arrow-head-left", "", false);
        }
        break;
      case "column-reverse":
        setAxis("vertical", "arrow-head-up", "", true);
        if(normalWrap) {
          setAxis("horizontal", "", "arrow-head-right", false);
        } else {
          setAxis("horizontal", "arrow-head-left", "", false);
        }
        break;
      case "row-reverse":
        setAxis("horizontal", "arrow-head-left", "", true);
        if(normalWrap) {
          setAxis("vertical", "", "arrow-head-down", false);
        } else {
          setAxis("vertical", "arrow-head-up", "", false);
        }
        break;
      default:
        setAxis("horizontal", "", "arrow-head-right", true);
        if(normalWrap) {
          setAxis("vertical", "", "arrow-head-down", false);
        } else {
          setAxis("vertical", "arrow-head-up", "", false);
        }
    }
  }

  /**
   * Sets the given axis's first and last element to the given class to change their direction
   * and labels it with the given label
   *
   * @param  {string}  axis     the id of the axis to change
   * @param  {string}  first    the class to apply to the first element
   * @param  {string}  last     the class to apply to the last element
   * @param  {boolean} mainAxis if the axis is the main axis
   */
  function setAxis(axis, first, last, mainAxis) {
    id(axis).firstElementChild.className = first;
    id(axis).lastElementChild.className = last;
    id(axis).className = mainAxis ? "red" : "blue";
    id(axis).querySelector("span").innerText = mainAxis ? "main axis" : "cross axis";
  }

  /**
   * Sets up event listeners for the collapsables
   */
  function setupCollapse() {
    let coll = document.querySelectorAll(".collapse");
    for (let i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", toggleCollapse);
    }
  }

  /**
   * Sets up event listeners for the boxes
   */
  function setupBoxes() {
    let boxes = document.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].addEventListener("click", toggleSelect);
      boxes[i].id = "box-" + i;
      setupBoxDrag(boxes[i]);
    }
  }

  /**
   * Sets up value buttons to add CSS to appropriate editors
   */
  function setupValueButtons() {
    let contain = document.querySelectorAll("#container-flex-properties .value-btn");
    for (let i = 0; i < contain.length; i++) {
      contain[i].addEventListener("click", function() { addProperty(contain[i], "container-input"); });
    }

    let items = document.querySelectorAll("#item-flex-properties .value-btn");
    for (let j = 0; j < items.length; j++) {
      items[j].addEventListener("click", function() { addProperty(items[j], "item-input"); });
    }
  }

  /**
   * Toggles the collapsable, showing/hiding it's content
   */
  function toggleCollapse() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  }

  /**
   * Toggles boxes between the selected and deselected state
   */
  function toggleSelect() {
    this.classList.toggle("selected");
  }

  /**
   * Adds the property value stored in the buttons to the editor
   *
   * @param  {object} label label button that was clicked on
   * @param  {string} input textarea editor to append style to
   */
  function addProperty(label, input) {
    console.log(label.parentElement.dataset["property"] + ": " + label.innerText);
    let propertyRegex = new RegExp(`(${label.parentElement.dataset["property"]} *: *)[\\w-%]*`);
    console.log(propertyRegex);
    if(propertyRegex.test(id(input).value)) {
      id(input).value = id(input).value.replace(propertyRegex, `$1${label.innerText}`);
    } else {
      id(input).value += "\n" + label.parentElement.dataset["property"] + ": " + label.innerText + ";";
    }
    updateContainer();
    updateItem();
  }

  /**
   * Returns the element in the document with the given id
   *
   * @param  {string} id id of the element to return
   */
  function id(id) {
    return document.getElementById(id);
  }
})();
