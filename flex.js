// Add interavtivity to the website through collapsables and applies
// styles in the textarea editors to the container and items on the right
// of the page.

"use strict";
(function() {

  /* --------------------------------------- Constants ------------------------------------ */

  // Draggable pickup sound effect
  const PICKUP_SFX = "audio/pickup.mp3";
  // Draggable drop sound effect
  const DROP_SFX = "audio/dropdown.mp3";
  // Draggable drop delete sound effect
  const BIN_SFX = "audio/trash.mp3";
  // Add box sound effect
  const ADD_SFX = "audio/add.mp3";
  // Trash can default image path
  const BIN_CLOSED = "image/trashcan_close.png";
  // Trash can drag over image path
  const BIN_OPEN = "image/trashcan_open.png";

  /* ------------------------------------ Initialization ---------------------------------- */

  window.addEventListener("load", initialize);

  /**
   * Initializes event listeners, sets up container.
   */
  function initialize() {
    id("container-input").addEventListener("input", updateContainer);
    id("item-input").addEventListener("input", updateItem);
    id("add-box").addEventListener("click", addBox);

    id("delete-drop").addEventListener("dragover", dragoverDeleteZone);
    id("delete-drop").addEventListener("dragleave", dragleaveDeleteZone);
    id("delete-drop").addEventListener("drop", deleteBox);

    id("get-url-btn").addEventListener("click", getCSSURL);

    id("container-input").value = getURLParam("container", "");
    id("item-input").value = getURLParam("selected", "");

    setupCollapse();
    setupValueButtons();
    setupBoxes();
    updateContainer();
    updateAxis();
  }

  /* ----------------------------------------- Setup -------------------------------------- */

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
      contain[i].addEventListener("click", function() {
        addProperty(contain[i], "container-input");
      });
    }
    let items = document.querySelectorAll("#item-flex-properties .value-btn");
    for (let j = 0; j < items.length; j++) {
      items[j].addEventListener("click", function() {
        addProperty(items[j], "item-input");
      });
    }
  }

  /**
   * Sets up event listeners for draggable boxes
   * @param  {object} box - element to attach event listener to
   */
  function setupBoxDrag(box) {
    box.addEventListener("dragstart", boxDragStart);
    box.addEventListener("dragend", boxDragEnd);
  }

  /* ------------------------------------ Flex Container ---------------------------------- */

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
        if (normalWrap) {
          setAxis("horizontal", "", "arrow-head-right", false);
        } else {
          setAxis("horizontal", "arrow-head-left", "", false);
        }
        break;
      case "column-reverse":
        setAxis("vertical", "arrow-head-up", "", true);
        if (normalWrap) {
          setAxis("horizontal", "", "arrow-head-right", false);
        } else {
          setAxis("horizontal", "arrow-head-left", "", false);
        }
        break;
      case "row-reverse":
        setAxis("horizontal", "arrow-head-left", "", true);
        if (normalWrap) {
          setAxis("vertical", "", "arrow-head-down", false);
        } else {
          setAxis("vertical", "arrow-head-up", "", false);
        }
        break;
      default:
        setAxis("horizontal", "", "arrow-head-right", true);
        if (normalWrap) {
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
   * Adds the property value stored in the buttons to the editor
   * @param  {object} label label button that was clicked on
   * @param  {string} input textarea editor to append style to
   */
  function addProperty(label, input) {
    let property = label.parentElement.dataset["property"];
    let regex = new RegExp(`(${property} *: *)[\\w-%]*`);
    if (regex.test(id(input).value)) {
      id(input).value = id(input).value.replace(regex, `$1${label.innerText}`);
    } else {
      id(input).value += "\n" + property + ": " + label.innerText + ";";
    }
    updateContainer();
    updateItem();
  }

  /* --------------------------------------- Box Drag ------------------------------------- */

  /**
   * Hides the box while dragging
   * @param  {event} e - drag event
   */
  function boxDragStart(e) {
    this.style.opacity = 0;
    e.dataTransfer.setData("text", e.target.id);
    playSound(PICKUP_SFX);
  }

  /**
   * Shows the box again when drag ends
   * @param  {event} e - drag event
   */
  function boxDragEnd() {
    this.style.opacity = 1;
    playSound(DROP_SFX);
  }

  /**
   * Changes the appearence of trashcan when dragging over
   * @param  {event} e - drag event
   */
  function dragoverDeleteZone(e) {
    e.preventDefault();
    e.target.src = BIN_OPEN;
  }

  /**
   * Changes the appearence of trashcan when dragging out
   * @param  {event} e - drag event
   */
  function dragleaveDeleteZone(e) {
    e.preventDefault();
    e.target.src = BIN_CLOSED;
  }

  /**
   * Deletes the dropped box
   * @param  {event} e - drag event
   */
  function deleteBox(e) {
    e.preventDefault();
    playSound(BIN_SFX);
    e.target.src = BIN_CLOSED;
    let data = e.dataTransfer.getData("text");
    document.getElementById(data).remove();
    refreshBoxId();
  }

  /**
   * Adds a box to the container
   */
  function addBox() {
    playSound(ADD_SFX);
    let box = document.createElement("div");
    box.classList.add("box");
    box.draggable = true;
    box.addEventListener("click", toggleSelect);
    setupBoxDrag(box);
    id("boxes-container").appendChild(box);
    refreshBoxId();
  }

  /**
   * Reset ids for all boxes
   */
  function refreshBoxId() {
    let boxes = document.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].innerText = i;
      boxes[i].id = "box-" + i;
    }
  }

  /* ---------------------------------------- Toggles ------------------------------------- */

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

  /* ------------------------------------------- URL -------------------------------------- */

  // Gimmiky way to add this function but I feel like this function would be useful

  function getURLParam(param, defaultValue) {
    let result = defaultValue;
    if(window.location.href.indexOf(param) !== -1) {
      result = decodeURI(getUrlVars()[param]);
    }
    return result;
  }

  function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function(match, key, value) {
        vars[key] = value;
      });
    return vars;
  }

  function getCSSURL() {
    let url = "https://spectralharp.github.io/weird-flex/";
    let container = id("container-input").value.length !== 0 ? "container=" + encodeURI(id("container-input").value) : "";
    let item = id("item-input").value.length !== 0 ? "selected=" + encodeURI(id("item-input").value) : "";
    let add = "";
    if(container.length !== 0 || item.length !== 0) {
      add += "?"
      if(container.length !== 0) {
        add += container;
        if(item.length !== 0) {
          add += "&" + item;
        }
      } else {
        add += item;
      }
    }
    id("url-output").value = url + add;
  }

  /* ----------------------------------------- Helper ------------------------------------- */

  /**
   * Returns the element in the document with the given id
   * @param  {string} id id of the element to return
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Plays the sound file in the given path
   * @param  {string} path - path to the sound file
   */
  function playSound(path) {
    let audio = new Audio(path);
    audio.play();
  }
})();
