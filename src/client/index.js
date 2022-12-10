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