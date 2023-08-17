const gridContainer = document.querySelector(".grid");
const buttons = document.querySelectorAll(".btn");
const rangeSlider = document.querySelector("#rangeSlider");
const sizeValue = document.querySelector("#sizeValue");
const gridLinesBtn = document.querySelector("#gridLines");
const colorPicker = document.querySelector("#colorPicker");

function makeGrid(num = 16) {
  const cellSize = 100 / num;

  gridContainer.innerHTML = "";

  for (let i = 0; i < num ** 2; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.style.flex = `0 0 ${cellSize}%`;
    gridItem.addEventListener("mouseover", paintGrid);
    gridItem.addEventListener("mousedown", paintGrid);
    gridContainer.appendChild(gridItem);
  }
}

makeGrid();

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 300);
  });
});

gridLinesBtn.addEventListener("click", () => {
  const gridItems = document.querySelectorAll(".grid-item");
  gridLinesBtn.classList.toggle("active");
  gridItems.forEach((item) => {
    item.classList.toggle("grid-item--lines");
  });
});

function updateGridLines() {
  const gridItems = document.querySelectorAll(".grid-item");
  gridItems.forEach((item) => {
    if (gridLinesBtn.classList.contains("active")) {
      item.classList.add("grid-item--lines");
    } else {
      item.classList.remove("grid-item--lines");
    }
  });
}



rangeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  sizeValue.textContent = `${value} x ${value}`;
  makeGrid(value);
  updateGridLines();
});



