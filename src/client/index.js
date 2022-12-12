import {
    sendFireToServer,
    sendInputToServer,
    sendJoinToServer,
    tryConnect,
} from './network';
const {upsertObjects} = require('./render');
const Parameters = require('../data');

const tempIDData = `${Date.now()}`;

function handleGameData(data){upsertObjects(JSON.parse(data), tempIDData);}
function redirectToLogin(){window.location.href = Parameters.URL;}

document.addEventListener("keypress", logKeyDown);
document.addEventListener("keyup", logKeyUp);
document.addEventListener("mousemove", logMouseMove);
document.addEventListener("mousedown", logMouseDown);

let input = {w:0,a:0,s:0,d:0,m:0}
let joinData = {did:null, code:null};

const keys = Object.keys(input);

function logMouseDown(e){
    e.preventDefault();
    sendFireToServer();
}

function logKeyDown(e){tryToggleKey(e.key, 1) ? sendInputToServer(input) : {};}

function logKeyUp(e){tryToggleKey(e.key, 0) ? sendInputToServer(input) : {};}

function logMouseMove(e){
    const {clientX, clientY} = e;
    let m = Math.atan2(clientX - window.innerWidth / 2, window.innerHeight / 2 - clientY) + Math.PI;
    input.m = m;
    sendInputToServer(input);
}

function tryToggleKey(key, val){
    if(!keys.includes(key) || val == input[key]) return false;
    input[key] = val;
    return true;
}

const joinGameRequest = () => {
    const {code} = window.localStorage;
    if(!code) return window.location.href = Parameters.URL

    joinData.did = tempIDData;
    joinData.code = code;
    
    sendJoinToServer(joinData);

    document.addEventListener("keypress", logKeyDown);
    document.addEventListener("keyup", logKeyUp);
}

tryConnect(handleGameData, redirectToLogin).then( () => {
    joinGameRequest();
})


