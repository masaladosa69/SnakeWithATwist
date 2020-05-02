const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
<<<<<<< HEAD
const scale = 6;
=======
const scale = 10;
>>>>>>> 939e8e2e8eb76ee6755b9f11dc7160b9d180e483
const rows = canvas.height / scale;
const columns = canvas.width / scale;
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
<<<<<<< HEAD
      .innerText = "Score: " + snake.total;
=======
      .innerText = snake.total;
>>>>>>> 939e8e2e8eb76ee6755b9f11dc7160b9d180e483

  }, 250);
}());

window.addEventListener('keydown', ((evt) => {
  const direction = evt.key.replace('Arrow', '');
  snake.changeDirection(direction);
}));
