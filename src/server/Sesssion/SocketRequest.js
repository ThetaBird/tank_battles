const Parameters = require('../../data');

function SocketRequestHandler(socket, Session){
    this.socket = socket;
    this.Session = Session;
    this.uid = null;

    const {JOIN_GAME, GAME_UPDATE, USER_INPUT, SPAWN} = Parameters.SOCKET_PROTOCOL_RCV;

    socket.on(JOIN_GAME, (data) => join_game(this, data));
    

    this.init_game_RH = () => {
        socket.on(GAME_UPDATE, (data) => game_update(this, data));
        socket.on(USER_INPUT, (data) => game_input(this, data));
        socket.on(SPAWN, (data) => game_spawn(this, data));
    }
}

const join_game = (handler, data) => {
    const {Session, socket, init_game_RH} = handler;
    handler.uid = data.uid;
    Session.addUser(socket.id, data)
    init_game_RH();
}       

const game_update = (handler, data) => {

}

const game_input = (handler, data) => {
    console.log({data})
    const {Session, uid} = handler;
    Session.updateTankInput(uid, data);
}

const game_spawn = (handler, type) => {
    console.log("Game Spawn Request")
    const {Session, uid} = handler;
    Session.spawnTank({uid, type});

}

module.exports = {SocketRequestHandler};
