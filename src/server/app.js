require("dotenv").config();
const {ENV, PRODURL, PRODPORT, DEVURL, DEVPORT} = process.env;

const {Server} = require("socket.io");
const express = require("express");
const path = require("path");
const {SocketRequestHandler} = require('./Sesssion/SocketRequest');
const {SessionController} = require("./Sesssion/SessionController");
const {getGoogleAuthURL} = require("./Google/OAuth");


const app = express();
const authURL = getGoogleAuthURL();
/*
const publicPath = path.resolve(__dirname, "../../public");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
*/

process.on('unhandledRejection', async error => {
    console.error('Unhandled promise rejection:', error);
});


app.set("views", path.resolve(__dirname, "../../public"));
app.use(express.static(path.join(__dirname, "../../public")));
app.use(express.json());
app.use(express.urlencoded());
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("login", {authURL}));
app.get("/play", (req, res) => res.render("game", {authURL}));


const PORT = ENV == "DEV" ? DEVPORT : PRODPORT;
const server = app.listen(PORT);
console.log(`Listening on port ${PORT}`);

const io = new Server(server);

const Session = new SessionController(io);
Session.createRound()

io.on('connection', (socket) => {
    console.log(socket.id);
    new SocketRequestHandler(socket, Session);
});

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};
