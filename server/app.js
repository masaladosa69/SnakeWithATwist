const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "../client")));

io.on("connection", (socket) => {
  socket.on('move', (msg) => {
    io.emit('move', msg);
  });
});

module.exports = http;
