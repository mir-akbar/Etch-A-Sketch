const gridContainer = document.querySelector(".grid");
const buttons = document.querySelectorAll(".btn");
const rangeSlider = document.querySelector("#rangeSlider");
const sizeValue = document.querySelector("#sizeValue");
const gridLinesBtn = document.querySelector("#gridLines");
const colorPicker = document.querySelector("#colorPicker");
const clearBtn = document.querySelector("#clearGrid");
const eraserBtn = document.querySelector("#eraser");
const colorModeBtn = document.querySelector("#colorMode");
const shadingBtn = document.querySelector("#shadingMode");
const lightenBtn = document.querySelector("#lightenMode");
const rainbowModeBtn = document.querySelector("#rainbowMode");

activateBtn(colorModeBtn);
let currentMode = "color";

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function applyPaint(e, color) {
  e.target.style.transition = "none";
  e.target.style.backgroundColor = color;

  setTimeout(() => {
    e.target.style.transition = "";
  }, 10);
}

function getRandomColor() {
  const randomR = Math.floor(Math.random() * 256);
  const randomG = Math.floor(Math.random() * 256);
  const randomB = Math.floor(Math.random() * 256);
  const randomColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
  return randomColor;
}

function darkenColor(rgbColor, shadeCount) {
  const rgbValues = rgbColor.match(/\d+/g); // Extract RGB values as an array
  let r = parseInt(rgbValues[0]);
  let g = parseInt(rgbValues[1]);
  let b = parseInt(rgbValues[2]);

  const decrement = Math.floor(255 / 10);
  if (shadeCount === 10) return `rgb(0, 0, 0)`;
  const newR = Math.max(0, r - decrement);
  const newG = Math.max(0, g - decrement);
  const newB = Math.max(0, b - decrement);

  return `rgb(${newR}, ${newG}, ${newB})`;
}

function lightenColor(rgbColor, lightenCount) {
  const rgbValues = rgbColor.match(/\d+/g);
  let r = parseInt(rgbValues[0]);
  let g = parseInt(rgbValues[1]);
  let b = parseInt(rgbValues[2]);

  const increment = Math.floor(255 / 10);
  if (lightenCount === 10) return `rgb(255, 255, 255)`;
  const newR = Math.min(255, r + increment);
  const newG = Math.min(255, g + increment);
  const newB = Math.min(255, b + increment);

  return `rgb(${newR}, ${newG}, ${newB})`;
}

function applyShading(e) {
  const currentBgColor = e.target.style.backgroundColor || "rgb(255, 255, 255)";
  const currentShadeCount = parseInt(e.target.dataset.shadeCount) || 0;
  if (currentShadeCount < 10) {
    const newShadeCount = currentShadeCount + 1;
    const newBgColor = darkenColor(currentBgColor, newShadeCount);
    applyPaint(e, newBgColor);
    e.target.dataset.shadeCount = newShadeCount;
  }
}

function applyLightening(e) {
  const currentBgColor = e.target.style.backgroundColor;
  const currentLightenCount = parseInt(e.target.dataset.lightenCount) || 0;
  if (!currentBgColor) return;
  if (currentLightenCount < 10) {
    const newLightenCount = currentLightenCount + 1;
    const newBgColor = lightenColor(currentBgColor, newLightenCount);
    applyPaint(e, newBgColor);
    e.target.dataset.lightenCount = newLightenCount;
  }
}

function paintGrid(e) {
  const color = colorPicker.value;
  if (e.type === "mouseover" && !mouseDown) return;
  else if (currentMode === "rainbow") {
    const randomColor = getRandomColor();
    applyPaint(e, randomColor);
  } else if (currentMode === "color") {
    applyPaint(e, color);
  } else if (currentMode === "eraser") {
    applyPaint(e, "rgb(255, 255, 255");
  } else if (currentMode === "shading") {
    applyShading(e);
  } else if (currentMode === "lighten") {
    applyLightening(e);
  }
}

function makeGrid(num = 16) {
  const cellSize = 100 / num;

  gridContainer.innerHTML = "";

  for (let i = 0; i < num ** 2; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.style.flex = `1 1 ${cellSize}%`;
    gridItem.addEventListener("mouseover", paintGrid);
    gridItem.addEventListener("mousedown", paintGrid);
    gridContainer.appendChild(gridItem);
  }
}

makeGrid();

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("clicked");
  });

  button.addEventListener("transitionend", () => {
    button.classList.remove("clicked");
  });
});

function handleRangeSliderInput(e) {
  const value = e.target.value;
  sizeValue.textContent = `${value} x ${value}`;
  makeGrid(value);
  updateGridLines();
}

function showGridLines() {
  activateBtn(gridLinesBtn);
  gridLinesBtn.classList.toggle("lines--active");
  updateGridLines();
}

function removeGridLines() {
  gridLinesBtn.classList.remove("btn--active");
  const gridItems = document.querySelectorAll(".grid-item");
  gridLinesBtn.classList.remove("lines--active");
  gridItems.forEach((item) => {
    item.classList.remove("grid-item--lines");
  });
}

function updateGridLines() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (gridLinesBtn.classList.contains("lines--active")) {
      item.classList.add("grid-item--lines");
    } else {
      item.classList.remove("grid-item--lines");
    }
  });
}

function clearGrid() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.style.backgroundColor = "rgb(255, 255, 255)";
  });
  colorMode();
  removeGridLines();
}

function activateBtn(btn) {
  btn.classList.toggle("btn--active");
}

function deactivateBtn() {
  buttons.forEach((btn) => {
    if (btn !== gridLinesBtn) btn.classList.remove("btn--active");
  });
}

function resetDataset() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    item.dataset.shadeCount = 0;
    item.dataset.lightenCount = 0;
  });
}

function eraser() {
  currentMode = "eraser";
  deactivateBtn();
  activateBtn(eraserBtn);
  resetDataset();
}

function colorMode() {
  currentMode = "color";
  deactivateBtn();
  activateBtn(colorModeBtn);
  colorPicker.value = "#000000";
  resetDataset();
}

function rainbowMode() {
  currentMode = "rainbow";
  deactivateBtn();
  activateBtn(rainbowModeBtn);
  resetDataset();
}

function shadingMode() {
  currentMode = "shading";
  deactivateBtn();
  activateBtn(shadingBtn);
  resetDataset();
}

function lightenMode() {
  currentMode = "lighten";
  deactivateBtn();
  activateBtn(lightenBtn);
  resetDataset();
}

rangeSlider.addEventListener("input", handleRangeSliderInput);
clearBtn.addEventListener("click", clearGrid);
eraserBtn.addEventListener("click", eraser);
gridLinesBtn.addEventListener("click", showGridLines);
colorModeBtn.addEventListener("click", colorMode);
rainbowModeBtn.addEventListener("click", rainbowMode);
shadingBtn.addEventListener("click", shadingMode);
lightenBtn.addEventListener("click", lightenMode);
