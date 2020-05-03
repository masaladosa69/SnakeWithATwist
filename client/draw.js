const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 10;
const rows = canvas.width / scale;
const columns = canvas.height / scale;
const socket = io();
let snake;
let fruit;
var allPlayersReady = false;
var fruitEatenIndex = 0;
let lockedDirection = "";
const keyMap = {Down:"ArrowDown",Up:"ArrowUp",Left:"ArrowLeft",Right:"ArrowRight"};
let fruitPositions = [];

(function setup() {
  window.setInterval(() => {
    console.log("ROWS: " + rows + " COLS: " + columns);
    if (allPlayersReady) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fruit.draw();
      snake.update();
      snake.draw();

      if (snake.eat(fruit)) {
        if (fruitEatenIndex == fruitPositions.length-1) {
          document.querySelector("#winBanner").classList.remove("hidden");
          document.querySelector('#restartButton').classList.remove("hidden");
          allPlayersReady = false;
        } else {
          fruitEatenIndex++;
          fruit.setLocation(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);
        }
      }

      snake.checkCollision();
      document.querySelector('.score').innerText = "Score: " + snake.total;
    }

  }, 250);
})();

const name = document.querySelector("#name");
const readyButton = document.querySelector("#readyButton");
readyButton.addEventListener("click", function() {
  document.querySelector('#nameLabel').classList.add("hidden");
  name.classList.add("hidden");
  readyButton.classList.add("hidden");
  socket.emit("ready", name.value);
});

const restartButton = document.querySelector("#restartButton");
restartButton.addEventListener("click", function() {
  socket.emit("restart", "restart");
});

window.addEventListener("keydown", (evt) => {
  if (allPlayersReady && evt.key === keyMap[lockedDirection]) {
    socket.emit("move", {x: snake.x, y: snake.y, direction: lockedDirection});
  }
});

let currentDirection = null;
socket.on("move", function (snakeVector) {
  if (snakeVector.direction !== currentDirection) {
    currentDirection = snakeVector.direction;
    snake.x = snakeVector.x;
    snake.y = snakeVector.y;
    snake.changeDirection(snakeVector.direction);
  }
});

socket.on("start", function(positions) {
  document.querySelector('.score').classList.remove("hidden");
  document.querySelector('#nameLabel').classList.add("hidden");
  name.classList.add("hidden");
  readyButton.classList.add("hidden");
  document.querySelector("#winBanner").classList.add("hidden");
  document.querySelector('#restartButton').classList.add("hidden");
  document.querySelector("#failBanner").classList.add("hidden");

  fruitPositions = positions;
  snake = new Snake();
  fruit = new Fruit(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);
  allPlayersReady = true;
});

socket.on("failure", function() {
  allPlayersReady = false;
  document.querySelector("#failBanner").classList.remove("hidden");
  document.querySelector('#restartButton').classList.remove("hidden");
});

socket.on("direction", function(playerObj) {
  if (playerObj.name.toLowerCase() === name.value.toLowerCase()) {
    lockedDirection = playerObj.direction;
    document.querySelector("#lockedDirection").textContent = "Your direction is " + playerObj.direction.toUpperCase();
  }
});