//Initializing constants and variables
const GAME_SPEED = 100;
const CANVAS_BG_COLOR = "white";
const CANVAS_BORDER_COLOR = "black";
const SNAKE_COLOR = "lightgreen";
const SNAKE_BORDER_COLOR = "darkgreen";
const canvas = document.querySelector(".gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [
  { x: 150, y: 150 },
  { x: 140, y: 150 },
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
];

//User score
let score = 0;
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;
// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;

let changingDirection = false;

/////////////////////////////////////////////////////////

const randomTen = function (min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
};

////////////////////////////////////
// CANVAS FUNCTIONS
const clearCanvas = () => {
  ctx.fillStyle = CANVAS_BG_COLOR;
  ctx.strokestyle = CANVAS_BORDER_COLOR;

  // Set canvas dimensions based on CSS size (max-width: 300px)
  // canvas.width = canvas.offsetWidth;
  // console.log(canvas.width);
  // canvas.height = canvas.offsetHeight;
  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  ctx.strokeRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
};
////////////////////////////////

////////////////////////////////////
// SNAKE FUNCTIONS
const drawSnakePart = (snakePart) => {
  ctx.fillStyle = SNAKE_COLOR;
  ctx.strokestyle = SNAKE_BORDER_COLOR;

  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

const drawSnake = () => {
  snake.forEach(drawSnakePart);
};

const advanceSnake = () => {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    score += 10;
    document.querySelector(".score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
};

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  /**
   * Prevent the snake from reversing
   * Example scenario:
   * Snake is moving to the right. User presses down and immediately left
   * and the snake immediately changes direction without taking a step down first
   */
  if (changingDirection) return;
  changingDirection = true;

  const keyPressed = event.keyCode;

  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function changeDirectionByButton(btnDirection) {
  // console.log(btnDirection);
  // debugger;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (changingDirection) return;
  changingDirection = true;

  if (btnDirection === "up" && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (btnDirection === "down" && !goingUp) {
    dx = 0;
    dy = 10;
  }

  if (btnDirection === "left" && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (btnDirection === "right" && !goingLeft) {
    dx = 10;
    dy = 0;
  }
}
/////////////////////////////////////////

////////////////////////////////////////
//FOOD FUNCTIONS
const createFood = () => {
  foodX = randomTen(0, canvas.width - 10);
  foodY = randomTen(0, canvas.height - 10);

  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
};

const drawFood = () => {
  ctx.fillStyle = "red";
  ctx.strokestyle = "darkred";
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
};
//////////////////////////////////////////////

//////////////////////////////////////////////
//GAME MECHANICS FUNCTIONS
const didGameEnd = () => {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
};

const main = function () {
  if (didGameEnd()) return;
  setTimeout(() => {
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();

    drawSnake();
    main();
  }, GAME_SPEED);
};

////////////////////////////////////////
//GAME INITIALIZING AND STARTING
document.addEventListener("keydown", (event) => {
  let button;
  switch (event.key) {
    case "ArrowUp":
      button = document.querySelector("button:nth-child(2)");
      break;
    case "ArrowLeft":
      button = document.querySelector("button:nth-child(4)");
      break;
    case "ArrowDown":
      button = document.querySelector("button:nth-child(5)");
      break;
    case "ArrowRight":
      button = document.querySelector("button:nth-child(6)");
      break;
    default:
      return; // Exit if it's not an arrow key
  }
  if (button) {
    button.classList.add("active");
  }
});

document.addEventListener("keyup", (event) => {
  let button;
  switch (event.key) {
    case "ArrowUp":
      button = document.querySelector("button:nth-child(2)");
      break;
    case "ArrowLeft":
      button = document.querySelector("button:nth-child(4)");
      break;
    case "ArrowDown":
      button = document.querySelector("button:nth-child(5)");
      break;
    case "ArrowRight":
      button = document.querySelector("button:nth-child(6)");
      break;
    default:
      return;
  }
  if (button) {
    button.classList.remove("active");
  }
});
const buttons = {
  up: document.querySelector('button[data-direction="up"]'),
  left: document.querySelector('button[data-direction="left"]'),
  down: document.querySelector('button[data-direction="down"]'),
  right: document.querySelector('button[data-direction="right"]'),
};

// debugger;
buttons.up.addEventListener("click", () => {
  changeDirectionByButton("up");
});
buttons.down.addEventListener("click", () => {
  changeDirectionByButton("down");
});
buttons.left.addEventListener("click", () => {
  changeDirectionByButton("left");
});
buttons.right.addEventListener("click", () => {
  changeDirectionByButton("right");
});

document.addEventListener("keydown", changeDirection);

// buttons.up.addEventListener("click", changeDirectionUp);
// buttons.up.addEventListener("click", changeDirectionDown);
// buttons.up.addEventListener("click", changeDirectionLeft);
// buttons.up.addEventListener("click", changeDirectionRight);
createFood();
main();
