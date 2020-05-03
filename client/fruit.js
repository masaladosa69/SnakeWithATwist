class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  setLocation(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = "#4cafab";
    ctx.fillRect(this.x, this.y, scale, scale)
  }
}
