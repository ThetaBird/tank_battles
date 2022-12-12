import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';

const Parameters = require('../data');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const connectedPromise = new Promise(resolve => {
    socket.on('connect', () => {
      console.log('Connected to server!');
      resolve();
    });
});
  

const connect = (handleGameData, redirectToLogin) => (
    connectedPromise.then(() => {
        socket.on(Parameters.SOCKET_PROTOCOL_SND.GAME_DATA, handleGameData);
        socket.on(Parameters.SOCKET_PROTOCOL_SND.UNAUTH, redirectToLogin);
        socket.on(Parameters.SOCKET_PROTOCOL_SND.AUTH, () => sendSpawnToServer(Parameters.TANK_TYPES.RECO));
        socket.on('disconnect', () => {console.log('Disconnected from server.'); redirectToLogin()});
    })
);

export const sendFireToServer = throttle(Parameters.NETWORK_LIMITS.FIRELIMIT, () => socket.emit(Parameters.SOCKET_PROTOCOL_RCV.FIRE));
export const sendInputToServer = throttle(Parameters.NETWORK_LIMITS.INPUTLIMIT, (data) => socket.emit(Parameters.SOCKET_PROTOCOL_RCV.USER_INPUT, data));
export const sendJoinToServer = throttle(Parameters.NETWORK_LIMITS.JOINLIMIT, (data) => socket.emit(Parameters.SOCKET_PROTOCOL_RCV.JOIN_GAME, data));
export const sendSpawnToServer = throttle(Parameters.NETWORK_LIMITS.SPAWNLIMIT, () => socket.emit(Parameters.SOCKET_PROTOCOL_RCV.SPAWN, Parameters.TANK_TYPES.RECO));

export const tryConnect = async (callback1, callback2) => Promise.all([connect(callback1, callback2)]);
