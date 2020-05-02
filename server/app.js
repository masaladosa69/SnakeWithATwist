const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "../client")));

const players = [];

io.on("connection", (socket) => {
  socket.on("move", (direction) => {
    io.emit("move", direction);
  });

  socket.on("ready", (name) => {
    if (!players.find((player) => player === name)) {
      players.push(name);
    }

    if (players.length === 4) {
      io.emit("start", "start");
    }
  });

  socket.on("restart", (msg) => {
    players = [];
  });
});

module.exports = http;
