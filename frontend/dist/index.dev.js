"use strict";

var BG_COLOUR = '#231f20';
var SNAKE_COLOUR = '#c2c2c2';
var FOOD_COLOUR = '#e66916';
var socket = io("http://localhost:3000");
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
var gameScreen = document.getElementById("gameScreen");
var canvas, ctx;

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext('2d');
  ctx.fillStyle = BG_COLOUR;
  canvas.height = canvas.width = 600;
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  document.addEventListener("keydown", keydown);
}

function gamePaint(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.height, canvas.width);
  var player = state.player,
      gridSize = state.gridSize,
      food = state.food;
  var size = canvas.width / gridSize;
  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);
  playerPaint(player, size);
}

function playerPaint(player, size) {
  ctx.fillStyle = SNAKE_COLOUR;
  player.snake.forEach(function (s) {
    ctx.fillRect(s.x * size, s.y * size, size, size);
  });
}

function keydown(e) {
  socket.emit("keydown", e.keyCode);
}

function handleInit(data) {
  console.log(data);
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState);
  requestAnimationFrame(function () {
    return gamePaint(gameState);
  });
}

init();