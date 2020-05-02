const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 6;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const socket = io();
var snake;

(function setup() {
  snake = new Snake();
  fruit = new Fruit();
  fruit.pickLocation();

  window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
      fruit.pickLocation();
    }

    snake.checkCollision();
    document.querySelector('.score')
      .innerText = "Score: " + snake.total;
  }, 250);
})();

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
