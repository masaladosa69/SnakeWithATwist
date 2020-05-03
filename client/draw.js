const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 6;
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
    if (allPlayersReady) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fruit.draw();
      snake.update();
      snake.draw();

      if (snake.eat(fruit)) {
        if (fruitEatenIndex == fruitPositions.length-1) {
          document.querySelector("#winBanner").textContent = "YOU SURVIVED COVID-19";
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
  fruitPositions = positions;
  snake = new Snake();
  fruit = new Fruit(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);
  allPlayersReady = true;
});

socket.on("direction", function(playerObj) {
  if (playerObj.name.toLowerCase() === name.value.toLowerCase()) {
    lockedDirection = playerObj.direction;
    document.querySelector("#lockedDirection").textContent = "Your direction is " + playerObj.direction.toUpperCase();
  }
});