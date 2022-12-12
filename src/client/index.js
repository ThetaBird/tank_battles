import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

const {upsertObjects} = require('./render');
const Parameters = require('../data');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const tempIDData = `${Date.now()}`;

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    });
  });

const connect = () => (
    connectedPromise.then(() => {
        socket.on(Parameters.SOCKET_PROTOCOL_SND.GAME_DATA, handleGameData);
        socket.on(Parameters.SOCKET_PROTOCOL_SND.UNAUTH, redirectToLogin);
        socket.on(Parameters.SOCKET_PROTOCOL_SND.AUTH, () => spawnTankRequest(Parameters.TANK_TYPES.RECO));
        socket.on('disconnect', () => {console.log('Disconnected from server.'); location.reload()});
    })
  );

Promise.all([
    connect()
])

document.addEventListener("keypress", logKeyDown);
document.addEventListener("keyup", logKeyUp);
document.addEventListener("mousemove", logMouseMove);
document.addEventListener("mousedown", logMouseDown);

function handleGameData(data){
    //console.log(data);
    upsertObjects(JSON.parse(data), tempIDData);
}

function redirectToLogin(){
    window.location.href = "http://localhost:8080"
}

let input = {
    w:0,
    a:0,
    s:0,
    d:0,
    m:0
}

const keys = Object.keys(input);

function logKeyDown(e){
    tryToggleKey(e.key, 1) ? sendInputToServer() : {};
}

function logKeyUp(e){
    tryToggleKey(e.key, 0) ? sendInputToServer() : {};
}

function logMouseMove(e){
    const {clientX, clientY} = e;
    let m = Math.atan2(clientX - window.innerWidth / 2, window.innerHeight / 2 - clientY) + Math.PI;
    input.m = m;
    console.log(m);
    sendInputToServer();
}

const fireLimit = 1000/10;
const sendFireToServer = throttle(fireLimit, () => {
    socket.emit(Parameters.SOCKET_PROTOCOL_RCV.FIRE);
})

function logMouseDown(e){
    e.preventDefault();
    sendFireToServer();
}




function tryToggleKey(key, val){
    if(!keys.includes(key) || val == input[key]) return false;
    input[key] = val;
    return true;
}

const limit = 1000/60;
const sendInputToServer = throttle(limit, () => {
    socket.emit(Parameters.SOCKET_PROTOCOL_RCV.USER_INPUT, input);
})

const joinGameRequest = () => {
    const {code} = window.localStorage;
    if(!code) return window.location.href = "http://localhost:8080/"

    const data = {
        displayName:tempIDData,
        code,
    }
    socket.emit(Parameters.SOCKET_PROTOCOL_RCV.JOIN_GAME, data);
    document.addEventListener("keypress", logKeyDown);
    document.addEventListener("keyup", logKeyUp);
}

const spawnTankRequest = (type) => {
    socket.emit(Parameters.SOCKET_PROTOCOL_RCV.SPAWN, type)
}


joinGameRequest();

