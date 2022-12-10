import io from 'socket.io-client';

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    });
  });

const connect = () => (
    connectedPromise.then(() => {
      socket.on('disconnect', () => {
        console.log('Disconnected from server.');
      });
    })
  );

Promise.all([
    connect()
])

document.addEventListener("keypress", logKeyDown);
document.addEventListener("keyup", logKeyUp);

let input = {
    w:0,
    a:0,
    s:0,
    d:0,
}

const keys = Object.keys(input);

function logKeyDown(e){
    tryToggleKey(e.key, 1);
}

function logKeyUp(e){
    tryToggleKey(e.key, 0);
}

function tryToggleKey(key, val){
    if(!keys.includes(key) || val == input[key]) return false;
    input[key] = val;
    console.log(`Set key ${key} to ${val}`);
    return true;
}