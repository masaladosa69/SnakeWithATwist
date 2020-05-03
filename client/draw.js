const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 6;
const socket = io();
var snake;
var allPlayersReady = false;
var fruitEatenIndex = 0;
let lockedDirection = "";
const keyMap = {Down:"ArrowDown",Up:"ArrowUp",Left:"ArrowLeft",Right:"ArrowRight"};
let fruitPositions = [{x: 13, y: 123}];

(function setup() {
  snake = new Snake();
  fruit = new Fruit(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);

  window.setInterval(() => {
    if (allPlayersReady) {
      ctx.clearRect(0, 0, 600, 600);
      fruit.draw();
      snake.update();
      snake.draw();

      if (snake.eat(fruit)) {
        if (fruitEatenIndex == fruitPositions.length-1) {
          const winBannerContainer = document.querySelector("#winBanner");
          const winBanner = document.createElement("p");
          winBanner.textContent = "YOU SURVIVED COVID-19";
          winBannerContainer.appendChild(winBanner);
          allPlayersReady = false;
        } else {
          fruitEatenIndex++;
          fruit.setLocation(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);
        }
      }

      snake.checkCollision();
      document.querySelector('.score')
        .innerText = "Score: " + snake.total;
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
  const direction = evt.key.replace("Arrow", "");
  if (allPlayersReady && evt.key === keyMap[lockedDirection]) {
    snake.changeDirection(direction);
  }
});

let currentDirection = null;

socket.on("move", function (direction) {
  if (direction !== currentDirection) {
    currentDirection = direction;
    snake.changeDirection(direction);
  }
});

socket.on("start", function(positions) {
  fruitPositions = positions;
  allPlayersReady = true;
});

socket.on("direction", function(playerObj) {
  if (playerObj.name.toLowerCase() === name.value.toLowerCase()) {
    lockedDirection = playerObj.direction;
    document.querySelector("#lockedDirection").textContent = "Your direction is " + playerObj.direction.toUpperCase();
  }
});