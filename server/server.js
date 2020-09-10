const { FRAME_RATE } = require("./constants");
const { createGameState, gameLoop } = require("./game");
const io = require("socket.io")();
io.on("connection", client => {
    const state = createGameState();
    setGameInterval(state, client);
    client.on("keydown", handleKeydown);

    function handleKeydown(keyCode) {
        try {
            keyCode = parseInt(keyCode);
            const vel = getUdatedVelocity(keyCode);
            state.player.vel = vel;
        } catch (error) {
            console.error(error);
        }
    }
});

function setGameInterval(state, client) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state);
        if (!winner) client.emit("gameState", JSON.stringify(state));
        else {
            client.emit("gameOver");
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
}

function getUdatedVelocity(keyCode) {
    switch (keyCode) {
        case 37:
            return { x: -1, y: 0 }
        case 38:
            return { x: 0, y: -1 }
        case 39:
            return { x: 1, y: 0 }
        case 40:
            return { x: 0, y: 1 }
    }
}
io.listen(3000);