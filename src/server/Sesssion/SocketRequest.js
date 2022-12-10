const Parameters = require('../../data');

function SocketRequestHandler(socket){
    this.socket = socket;
    const {JOIN_GAME, GAME_UPDATE, USER_INPUT, SPAWN} = Parameters.SOCKET_PROTOCOL_RCV;

    socket.on(JOIN_GAME, join_game_request_handler);
    socket.on(GAME_UPDATE, game_update_request_handler);
    socket.on(USER_INPUT, game_input_request_handler);
    socket.on(SPAWN, game_spawn_request_handler);
}

const join_game_request_handler = (data) => {
    console.log(data)
}

const game_update_request_handler = (data) => {

}

const game_input_request_handler = (data) => {
    console.log(data)
}

const game_spawn_request_handler = (data) => {

}

module.exports = {SocketRequestHandler};
