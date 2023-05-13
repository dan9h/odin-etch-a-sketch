let width = 16;
let height = 16;

let eraserActive = false;
let randomColorActive = false;
let gridLines = true;
let selectedColor = "#000";
let mouseDown = false;

const container = document.querySelector(".container");

function createElement(tagName, attributes, textContent) {
  const element = document.createElement(tagName);

  Object.assign(element, attributes);

  if (textContent && typeof textContent === "string") {
    element.textContent = textContent;
  }

  return element;
}

function createBoard(width, height) {
  const board = document.createElement("div");
  board.setAttribute("class", "board");

  for (let x = 0; x < width; x++) {
    const row = document.createElement("div");
    row.setAttribute("class", "board__row");

    for (let y = 0; y < height; y++) {
      const cell = document.createElement("div");
      cell.classList.add("board__cell");

      cell.addEventListener("mousedown", handleMouseDown);
      cell.addEventListener("mouseover", handleMouseOver);
      cell.addEventListener("mouseup", handleMouseUp);

      row.appendChild(cell);
    }

    board.appendChild(row);
  }

  return board;
}

function randomColor() {
  const R = randomHexValue();
  const G = randomHexValue();
  const B = randomHexValue();

  return `#${R + G + B}`;
}

function randomHexValue() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
}

function erase(target) {
  if (target.dataset.painted) {
    target.removeAttribute("style");
    target.removeAttribute("data-painted");
  }
}

function handleMouseDown(event) {
  event.preventDefault();

  mouseDown = true;

  handleMouseOver.bind(this)();
}

function handleMouseOver() {
  if (!mouseDown) return;

  if (eraserActive) {
    erase(this);
    return;
  }

  this.style.backgroundColor = randomColorActive
    ? randomColor()
    : selectedColor;

  this.dataset.painted = true;
}

function handleMouseUp() {
  mouseDown = false;
}

// COLOR PICKER

const ColorPicker = createElement("input", {
  type: "color",
});

ColorPicker.addEventListener("click", function () {
  SolidColor.activate();
  RandomColor.deactivate();
  Pen.activate();
  Eraser.deactivate();
});
ColorPicker.addEventListener("change", function () {
  selectedColor = this.value;
});

// SOLID COLOR OPTION

const SolidColor = createElement(
  "button",
  { className: "active" },
  "Solid Color"
);

SolidColor.deactivate = function () {
  this.classList.remove("active");
};

SolidColor.activate = function () {
  this.classList.add("active");

  Pen.activate();
  RandomColor.deactivate();
  Eraser.deactivate();
};

SolidColor.addEventListener("click", function () {
  this.activate();
});

// RANDOM COLOR OPTION

const RandomColor = createElement("button", null, "Random Color");

RandomColor.deactivate = function () {
  randomColorActive = false;
  this.classList.remove("active");
};

RandomColor.activate = function () {
  randomColorActive = true;
  this.classList.add("active");

  SolidColor.deactivate();
  Pen.activate();
  Eraser.deactivate();
};

RandomColor.addEventListener("click", function () {
  this.activate();
});

// PEN

const Pen = createElement(
  "button",
  {
    className: "active",
  },
  "Pen"
);

Pen.activate = function () {
  this.classList.add("active");
  Eraser.deactivate();
};

Pen.deactivate = function () {
  this.classList.remove("active");
};

Pen.addEventListener("click", function () {
  this.activate();
});

// ERASER

const Eraser = createElement("button", null, "Eraser");

Eraser.activate = function () {
  eraserActive = true;
  this.classList.add("active");
  Pen.deactivate();
};

Eraser.deactivate = function () {
  eraserActive = false;
  this.classList.remove("active");
};

Eraser.addEventListener("click", function () {
  this.activate();
});

// WIDTH SLIDER LABEL

const WidthSliderLabel = createElement(
  "label",
  {
    htmlFor: "width",
  },
  `${width} x ${height}`
);

// WIDTH SLIDER

const WidthSlider = createElement("input", {
  type: "range",
  min: 4,
  max: 64,
  value: width,
  id: "width",
});

WidthSlider.addEventListener("change", function () {
  const oldBoard = Board;
  const newBoard = createBoard(width, height);

  Board = newBoard;
  Board.className = oldBoard.className;

  Eraser.deactivate();
  Pen.activate();

  oldBoard.remove();
  container.appendChild(Board);
});

WidthSlider.addEventListener("input", function () {
  width = height = this.value;
  WidthSliderLabel.textContent = `${width} x ${height}`;
});

// CLEAR BUTTON

const Clear = createElement("button", null, "Clear");
Clear.addEventListener("click", function () {
  const oldBoard = Board;
  const newBoard = createBoard(width, height);

  Board = newBoard;
  Board.className = oldBoard.className;

  Eraser.deactivate();
  Pen.activate();

  oldBoard.remove();
  container.appendChild(Board);
});

const GridLines = createElement(
  "button",
  { className: gridLines ? "active" : "" },
  "Grid Lines"
);

GridLines.addEventListener("click", function () {
  gridLines = !gridLines;
  this.classList.toggle("active");
  Board.classList.toggle("grid-lines");
});

// CONTROLS CONTAINER

const Controls = document.createElement("div");

Controls.classList.add("controls");
Controls.append(
  ColorPicker,
  SolidColor,
  RandomColor,
  Pen,
  Eraser,
  WidthSliderLabel,
  WidthSlider,
  Clear,
  GridLines
);

// BOARD

let Board = createBoard(width, height);

gridLines && Board.classList.add("grid-lines");
Board.oncontextmenu = (e) => e.preventDefault();

container.append(Controls, Board);
