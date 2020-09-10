const { GRID_SIZE } = require("./constants");
module.exports.createGameState = () => {
    const gameState = {
        player: {
            pos: {
                x: 3,
                y: 10
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ]
        },
        food: {
            x: 7,
            y: 7
        },
        gridSize: GRID_SIZE
    }
    return gameState;
}


module.exports.gameLoop = (state) => {
    if (!state) return;
    const playerOne = state.player;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    if (playerOne.pos.x < 0 || playerOne.pos.y < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y > GRID_SIZE) {
        return 2;
    }
    if (playerOne.pos.x === state.food.x && playerOne.pos.y === state.food.y) {
        playerOne.snake.push({...playerOne.pos });
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        createRandomFood(state);
    }
    playerOne.snake.forEach(s => {
        if (s.x === playerOne.pos.x && s.y === playerOne.pos.y) return 2;
    });
    playerOne.snake.push({...playerOne.pos });
    playerOne.snake.shift();
    return false;
}

function createRandomFood(state) {
    const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    }
    state.player.snake.forEach((s) => {
        if (s.x === food.x && s.y === food.y) createRandomFood(state);
    });
    state.food = food;
}