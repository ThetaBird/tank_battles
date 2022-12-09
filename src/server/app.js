const http = require("http");
const {Server} = require("socket.io");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);