"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("./constants"),
    GRID_SIZE = _require.GRID_SIZE;

module.exports.createGameState = function () {
  var gameState = {
    player: {
      pos: {
        x: 3,
        y: 10
      },
      vel: {
        x: 1,
        y: 0
      },
      snake: [{
        x: 1,
        y: 10
      }, {
        x: 2,
        y: 10
      }, {
        x: 3,
        y: 10
      }]
    },
    food: {
      x: 7,
      y: 7
    },
    gridSize: GRID_SIZE
  };
  return gameState;
};

module.exports.gameLoop = function (state) {
  if (!state) return;
  var playerOne = state.player;
  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  if (playerOne.pos.x < 0 || playerOne.pos.y < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y > GRID_SIZE) {
    return 2;
  }

  if (playerOne.pos.x === state.food.x && playerOne.pos.y === state.food.y) {
    playerOne.snake.push(_objectSpread({}, playerOne.pos));
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    createRandomFood(state);
  }

  playerOne.snake.forEach(function (s) {
    if (s.x === playerOne.pos.x && s.y === playerOne.pos.y) return 2;
  });
  playerOne.snake.push(_objectSpread({}, playerOne.pos));
  playerOne.snake.shift();
  return false;
};

function createRandomFood(state) {
  var food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
  state.player.snake.forEach(function (s) {
    if (s.x === food.x && s.y === food.y) createRandomFood(state);
  });
  state.food = food;
}