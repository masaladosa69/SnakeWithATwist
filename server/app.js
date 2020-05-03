const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const movements = ["Left", "Right", "Up", "Down"];
const winCountNecessary = 10;
const scale = 6;
const rows = 600 / scale;
const columns = 600 / scale;

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
const fruitPositions = generateFruitPositions();

app.use(express.static(path.join(__dirname, "../client")));

const players = [];

io.on("connection", (socket) => {
  socket.on("move", (direction) => {
    io.emit("move", direction);
  });

  socket.on("ready", (name) => {
    if (!players.find((player) => player === name)) {
      const plaerObj = {name: name,direction: movements.pop()}
      players.push(plaerObj);
      io.emit("direction", plaerObj);
    }

    if (players.length === 2) {
      io.emit("start", fruitPositions);
    }
  });

  socket.on("restart", (msg) => {
    players = [];
  });
});

module.exports = http;
