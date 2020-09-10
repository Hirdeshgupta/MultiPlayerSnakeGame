const { FRAME_RATE } = require("./constants");
const { initGame, gameLoop } = require("./game");
const { makeid } = require("./utils");
const io = require("socket.io")();
const state = {};
const clientRooms = {};
io.on("connection", client => {
    setGameInterval(state, client);
    client.on("keydown", handleKeydown);
    client.on("newGame", handlenewGame);
    client.on("joinGame", handlejoinGame);

    function handlejoinGame(gameCode) {
        const room = io.sockets.adapter.rooms[gameCode];
        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }
        let numClients;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }
        if (numClients == 0) {
            client.emit("unknownRoom");
        } else if (numClients > 1) {
            client.emit("tooManyPlayers");
        }
        clientRooms[client.id] = gameCode;
        client.join(gameCode);
        client.number = 2;
        client.emit("inti", 2);
        setGameInterval(gameCode);
    }

    function handlenewGame() {
        let newRoom = makeid(5);
        clientRooms[client.id] = newRoom;
        client.emit("gameCode", newRoom);
        state[newRoom] = initGame();
        client.join(newRoom);
        client.number = 1;
        client.emit("init", 1);
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) {
            return;
        }
        try {
            keyCode = parseInt(keyCode);
            const vel = getUdatedVelocity(keyCode);
            if (vel) {
                state[roomName].player[client.number - 1].vel = vel;
            }
        } catch (error) {
            console.error(error);
        }
    }
});

function setGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);
        if (!winner) emitGameState(roomName, state[roomName]);
        else {
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
}

function emitGameState(roomName, state) {
    io.sockets.in(roomName)
        .emit("gameState", JSON.stringify(state));
}

function emitGameOver(roomName, winner) {
    io.sockets.in(roomName)
        .emit("gameOver", JSON.stringify({ winner }));
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