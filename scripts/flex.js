// Add interavtivity to the website through collapsables and applies
// styles in the textarea editors to the container and items on the right
// of the page.

"use strict";
(function() {

  /* --------------------------------------- Constants ------------------------------------ */

  // URL to github page
  const URL = "https://spectralharp.github.io/weird-flex/";
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
    window.addEventListener("resize", setBound);
    window.addEventListener("mouseup", updateSlider);
    window.addEventListener("contextmenu", contextMenuCheck);
    window.addEventListener("click", contextMenuClickCheck);

    id("container-input").addEventListener("input", updateContainer);
    id("item-input").addEventListener("input", updateItem);
    id("box-input").addEventListener("input", updateBox);
    id("add-box").addEventListener("click", addBox);

    id("delete-drop").addEventListener("dragover", dragoverDeleteZone);
    id("delete-drop").addEventListener("dragleave", dragleaveDeleteZone);
    id("delete-drop").addEventListener("drop", dragdropDeleteZone);
    id("delete-drop").addEventListener("click", deleteLastBox);

    id("get-url-btn").addEventListener("click", getCSSURL);

    id("width-slider").addEventListener("input", setSize);
    id("height-slider").addEventListener("input", setSize);

    id("container-input").value = getURLParam("container", "");
    id("item-input").value = getURLParam("selected", "");

    setBound();
    setupCollapse();
    setupValueButtons();
    setupBoxes();
    updateContainer();
    updateAxis();
    updateItem();
    updateSlider();
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
   * @param  {HTMLElement} box - element to attach event listener to
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
   * @param  {string}  axis     - the id of the axis to change
   * @param  {string}  first    - the class to apply to the first element
   * @param  {string}  last     - the class to apply to the last element
   * @param  {boolean} mainAxis - if the axis is the main axis
   */
  function setAxis(axis, first, last, mainAxis) {
    id(axis).firstElementChild.className = first;
    id(axis).lastElementChild.className = last;
    id(axis).className = mainAxis ? "red" : "blue";
    id(axis).querySelector("span").innerText = mainAxis ? "main axis" : "cross axis";
  }

  /**
   * Adds the property value stored in the buttons to the editor
   * @param  {HTMLElement} label - label button that was clicked on
   * @param  {string}      input - textarea editor to append style to
   */
  function addProperty(label, input) {
    let property = label.parentElement.dataset["property"];
    let regex = new RegExp(`(${property} *: *)[\\w-%]*`);
    if (regex.test(id(input).value)) {
      id(input).value = id(input).value.replace(regex, `$1${label.innerText}`);
    } else {
      id(input).value += (id(input).value === "" ? "" : "\n") + property + ": " + label.innerText + ";";
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
    this.style.opacity = null;
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
  function dragdropDeleteZone(e) {
    e.preventDefault();
    e.target.src = BIN_CLOSED;
    let data = e.dataTransfer.getData("text");
    deleteBox(document.getElementById(data));
  }


  /**
   * Removes the box
   * @param  {HTMLElement} box - box to remove
   */
  function deleteBox(box) {
    if(box === null) {
      return;
    }
    playSound(BIN_SFX);
    box.remove();
    refreshBoxId();
  }

  /**
   * Delete the box at the end of flex container
   */
  function deleteLastBox() {
    deleteBox(id("boxes-container").lastElementChild);
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

  /* ------------------------------------ Box Right Click --------------------------------- */

  /**
   * Check if context menu needs to be show, show/do nothing
   * @param  {event} e - click event
   */
  function contextMenuCheck(e) {
    if (clickInsideElement(e, "box")) {
      e.preventDefault();
      if(e.target !== null) {
        id("box-id-label").innerText = e.target.id;
        id("box-input").value = e.target.style.cssText.replace(/; /gi, ";\n");
      }
      positionMenu(e);
      toggleMenu(true);
    } else {
      if(!clickInsideElement(e, "box-menu")) {
        toggleMenu(false);
      }
    }
  }

  /**
   * Check if there's a click outside of the menu, if so, hide menu
   * @param  {event} e - click event
   */
  function contextMenuClickCheck(e) {
    if ((e.which || e.button) === 1 && !clickInsideElement(e, "box-menu")) {
      toggleMenu(false);
    }
  }

  /**
   * Check if the click is within an element with the given class name
   * @param  {event}  e         - click event
   * @param  {string} className - class name of elements to check
   */
  function clickInsideElement(e, className) {
    let el = e.srcElement || e.target;
    if (el.classList.contains(className)) {
      return el;
    } else {
      while (el = el.parentNode) {
        if (el.classList && el.classList.contains(className)) {
          return el;
        }
      }
    }
    return false;
  }

  /**
   * Show menu if given true, hide if false
   * @param  {boolean} on - whether the menu should be toggled
   */
  function toggleMenu(on) {
    if(on) {
      id("box-menu").classList.add("active");
    } else {
      let box = id(id("box-id-label").innerText);
      if(box !== null) {
        box.style.cssText = id("box-input").value;
      }
      id("box-menu").classList.remove("active");
    }
  }

  /**
   * Update the CSS text of the element that has the menu open
   */
  function updateBox() {
    let box = id(id("box-id-label").innerText);
    if(box !== null) {
      box.style.cssText = this.value;
    }
  }

  /**
   * Returns the position of the mouse event
   * @param  {event} e - click event
   */
  function getPosition(e) {
    let posX = 0;
    let posY = 0;

    if (!e) {
      let e = window.event;
    }

    if (e.pageX || e.pageY) {
      posX = e.pageX;
      posY = e.pageY;
    } else if (e.clientX || e.clientY) {
      posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posX,
      y: posY
    }
  }


  /**
   * positions the menu to the point clicked
   * @param  {event} e - click event
   */
  function positionMenu(e) {
    let menu = id("box-menu");
    let menuPosition = getPosition(e);
    menu.style.left = menuPosition.x + "px";
    menu.style.top = menuPosition.y + "px";
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

  /* -------------------------------------- Size Slider ----------------------------------- */


  /**
   * Sets the min and max values for size sliders
   */
  function setBound() {
    let style = window.getComputedStyle(id("boxes-container"));
    id("width-slider").min = pxToVw(parseInt(style.minWidth));
    id("width-slider").max = pxToVw(parseInt(style.maxWidth));
    id("height-slider").min = pxToVh(parseInt(style.minHeight));
    id("height-slider").max = pxToVh(parseInt(style.maxHeight));
    updateSlider();
  }

  /**
   * Sets the size of the flex container to the slider value
   */
  function setSize() {
    id("boxes-container").style.width = vwToPx(id("width-slider").value) + "px";
    id("boxes-container").style.height = vhToPx(id("height-slider").value) + "px";
  }

  /**
   * Update the slider's value to the size of the flex container
   */
  function updateSlider() {
    let style = window.getComputedStyle(id("boxes-container"));
    id("width-slider").value = pxToVw(parseInt(style.width));
    id("height-slider").value = pxToVh(parseInt(style.height));
  }

  /**
   * Converts unit vw to px
   * @param  {number} vw - vw to convert
   * @return {number} number of px represented by the given vw
   */
  function vwToPx(vw) {
    return vw / 100 * document.documentElement.clientWidth;
  }

  /**
   * Converts unit px to vw
   * @param  {number} px - px to convert
   * @return {number} number of vw represented by the given px
   */
  function pxToVw(px) {
    return Math.round(px / document.documentElement.clientWidth * 100);
  }

  /**
   * Converts unit vh to px
   * @param  {number} vh - vh to convert
   * @return {number} number of px represented by the given vh
   */
  function vhToPx(vh) {
    return vh / 100 * document.documentElement.clientHeight;
  }

  /**
   * Converts unit px to vh
   * @param  {number} px - px to convert
   * @return {number} number of vh represented by the given px
   */
  function pxToVh(px) {
    return Math.round(px / document.documentElement.clientHeight * 100);
  }

  /* ------------------------------------------- URL -------------------------------------- */

  // Gimmicky(?) way to add this function but I feel like it would be useful

  /**
   * Gets the value of a parameter in the URL
   * @param  {string} param        - parameter to get value for
   * @param  {string} defaultValue - default value to return if nothing is found
   * @return {string} value of the parameter
   */
  function getURLParam(param, defaultValue) {
    let result = defaultValue;
    if (window.location.href.indexOf(param) !== -1) {
      result = decodeURIComponent(getUrlVars()[param]);
    }
    return result;
  }

  /**
   * Returns an object that has the parameters in the URL as keys and values as values
   * @return {Object.<string, string>} object with parameters as keys and their values
   */
  function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(match, key, value) {
      vars[key] = value;
    });
    return vars;
  }

  /**
   * Generates string containing parameters and values to append to URL
   * @param  {Object.<string, string>} vars - object with parameters as keys and their values
   * @return {string}                  string to append to URL
   */
  function generateURLVars(vars) {
    if (vars.length === 0) {
      return "";
    }
    let varStrings = [];
    for (let k in vars) {
      if (vars.hasOwnProperty(k) && vars[k].length !== 0) {
        varStrings.push(`${k}=${vars[k]}`);
      }
    }
    if (varStrings.length === 0) {
      return "";
    }
    let result = "?";
    result += varStrings.join("&");
    return result;
  }

  /**
   * Generates URL in the input box in the About tab
   */
  function getCSSURL() {
    id("url-output").value = URL + generateURLVars({
      "container": encodeURIComponent(id("container-input").value),
      "selected": encodeURIComponent(id("item-input").value)
    });
  }

  /* ----------------------------------------- Helper ------------------------------------- */

  /**
   * Returns the element in the document with the given id
   * @param  {string}      id - id of the element to return
   * @return {HTMLElement} element in the document with the given id
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Plays the sound file in the given path
   * @param  {string} path - path to the sound file
   */
  function playSound(path) {
    if(!id("mute-checkbox").checked) {
      let audio = new Audio(path);
      audio.play();
    }
  }
})();
