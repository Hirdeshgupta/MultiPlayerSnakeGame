const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';
const socket = io("http://localhost:3000");
socket.on("init", handleInit);
socket.on("gameState", handleGameState);
socket.on("gameOver", handleGameOver);
socket.on("gameCode", handleGamecode);
socket.on("unknownRoom", handleunknownRoom);
socket.on("tooManyPlayers", handletooManyPlayers);
const gameScreen = document.getElementById("gameScreen");
const initialScreen = document.getElementById("initialScreen");
const newGameBtn = document.getElementById("newGameButton");
const joinGameBtn = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");


newGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

function newGame() {
    socket.emit("newGame");
    init();
}

function joinGame() {
    const code = gameCodeInput.value;
    socket.emit("joinGame", code);
    init();
}

let canvas, ctx, playerNumber;
let gameActive = false;


function init() {
    gameScreen.style.display = "block";
    initialScreen.style.display = "none";
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.fillStyle = BG_COLOUR;
    canvas.height = canvas.width = 600;
    ctx.fillRect(0, 0, canvas.height, canvas.width);
    document.addEventListener("keydown", keydown);
    gameActive = true;
}

function gamePaint(state) {
    ctx.fillStyle = BG_COLOUR;
    ctx.fillRect(0, 0, canvas.height, canvas.width);

    const { player, gridSize, food } = state;
    const size = canvas.width / gridSize;
    ctx.fillStyle = FOOD_COLOUR;
    ctx.fillRect(food.x * size, food.y * size, size, size);
    playerPaint(player[0], size, SNAKE_COLOUR);
    playerPaint(player[1], size, "red");

}

function playerPaint(player, size, color) {
    ctx.fillStyle = color;
    player.snake.forEach((s) => {
        ctx.fillRect(s.x * size, s.y * size, size, size);
    });
}

function keydown(e) {
    socket.emit("keydown", e.keyCode);
}

function handleInit(num) {
    playerNumber = num;
}

function handleGameState(gameState) {
    if (!gameActive) return;
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => gamePaint(gameState));
}

function handleGameOver(data) {
    if (!gameActive) return;
    data = JSON.parse(data);
    if (data.winner === playerNumber) {
        alert("You Winn !!");
    } else {
        alert("You Lose !!");
    }
}

function handleGamecode(code) {
    gameCodeDisplay.innerHTML = code;
}

function handletooManyPlayers() {
    reset1();
    alert("Too Many Players in the Room");
}

function handleunknownRoom() {
    reset1();
    alert("Game Room doesn't found");
}

function reset1() {
    playerNumber = null;
    gameCodeInput.value = "";
    gameCodeDisplay.innerHTML = "";
    initialScreen.style.css = "block";
    gameScreen.style.display = "none";
}