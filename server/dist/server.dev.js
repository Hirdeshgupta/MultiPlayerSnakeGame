"use strict";

var _require = require("./constants"),
    FRAME_RATE = _require.FRAME_RATE;

var _require2 = require("./game"),
    createGameState = _require2.createGameState,
    gameLoop = _require2.gameLoop;

var io = require("socket.io")();

io.on("connection", function (client) {
  var state = createGameState();
  setGameInterval(state, client);
  client.on("keydown", handleKeydown);

  function handleKeydown(keyCode) {
    try {
      keyCode = parseInt(keyCode);
      var vel = getUdatedVelocity(keyCode);
      state.player.vel = vel;
    } catch (error) {
      console.error(error);
    }
  }
});

function setGameInterval(state, client) {
  var intervalId = setInterval(function () {
    var winner = gameLoop(state);
    if (!winner) client.emit("gameState", JSON.stringify(state));else {
      client.emit("gameOver");
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function getUdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37:
      return {
        x: -1,
        y: 0
      };

    case 38:
      return {
        x: 0,
        y: -1
      };

    case 39:
      return {
        x: 1,
        y: 0
      };

    case 40:
      return {
        x: 0,
        y: 1
      };
  }
}

io.listen(3000);