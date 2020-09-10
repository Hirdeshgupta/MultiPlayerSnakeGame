const io = require("socket.io")();
io.on("connection", client => {
    client.emit("init", { data: "Hello World" });
});
io.listen(3000);