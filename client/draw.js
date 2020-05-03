const winCountNecessary = 10;

function getRandomX() {
  return (Math.floor(Math.random() * columns - 1) + 1) * scale;
}

function getRandomY() {
  return (Math.floor(Math.random() * rows - 1) + 1) * scale;
}

function generateFruitPositions() {
  const positions = [];
  for (let i = 0; i < winCountNecessary; i++) {
    positions[i] = {x: getRandomX(),y: getRandomY()};
  }
  return positions;
}

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 6;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const socket = io();
const fruitPositions = generateFruitPositions();
var snake;
var allPlayersReady = false;
var fruitEatenIndex = 0;

(function setup() {
  snake = new Snake();
  fruit = new Fruit(fruitPositions[fruitEatenIndex].x, fruitPositions[fruitEatenIndex].y);

  window.setInterval(() => {
    if (allPlayersReady) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

window.addEventListener("keydown", (evt) => {
  const direction = evt.key.replace("Arrow", "");
  snake.changeDirection(direction);
});

let currentDirection = null;

socket.on("move", function (direction) {
  if (direction !== currentDirection) {
    currentDirection = direction;
    snake.changeDirection(direction);
  }
});

socket.on("start", function() {
  allPlayersReady = true;
});
