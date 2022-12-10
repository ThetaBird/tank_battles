const {Server} = require("socket.io");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const {SocketRequestHandler} = require('./Sesssion/SocketRequest');
const {SessionController} = require("./Sesssion/SessionController");

const app = express();
const publicPath = path.resolve(__dirname, "../../public");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);
console.log(`Listening on port ${PORT}`);

const io = new Server(server);

const Session = new SessionController(io);
Session.createRound()

io.on('connection', (socket) => {
    console.log(socket.id);
    SocketRequestHandler(socket, Session);
});

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
