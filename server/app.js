const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
let movements = ["Left", "Right", "Up", "Down"];
const winCountNecessary = 10;
const scale = 6;


function getRandomX() {
  return (Math.floor(Math.random() * 50 - 1) + 1) * scale;
}

function getRandomY() {
  return (Math.floor(Math.random() * 50 - 1) + 1) * scale;
}

function generateFruitPositions() {
  const positions = [];
  for (let i = 0; i < winCountNecessary; i++) {
    positions[i] = {x: getRandomX(),y: getRandomY()};
  }
  return positions;
}

app.use(express.static(path.join(__dirname, "../client")));

let players = [];

io.on("connection", (socket) => {
  socket.on("move", (snakeVector) => {
    io.emit("move", snakeVector);
  });

  socket.on("ready", (name) => {
    if (!players.find((player) => player === name)) {
      const plaerObj = {name: name,direction: movements.pop()}
      players.push(plaerObj);
      io.emit("direction", plaerObj);
    }

    if (players.length === 4) {
      io.emit("start", generateFruitPositions());
    }
  });

  socket.on("restart", (msg) => {
    io.emit("start", generateFruitPositions());
  });
});

module.exports = http;
