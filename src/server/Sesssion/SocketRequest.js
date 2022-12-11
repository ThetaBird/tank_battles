const Parameters = require('../../data');

function SocketRequestHandler(socket, Session){
    this.socket = socket;
    this.Session = Session;
    this.uid = null;
    this.displayName = null;

    const {JOIN_GAME, GAME_UPDATE, USER_INPUT, SPAWN, FIRE} = Parameters.SOCKET_PROTOCOL_RCV;

    socket.on(JOIN_GAME, (data) => join_game(this, data));
    

    this.init_game_RH = () => {
        socket.on(GAME_UPDATE, (data) => game_update(this, data));
        socket.on(USER_INPUT, (data) => game_input(this, data));
        socket.on(SPAWN, (data) => game_spawn(this, data));
        socket.on(FIRE, () => game_fire(this));
    }
}

const join_game = (handler, data) => {
    const {Session, socket, init_game_RH} = handler;
    handler.uid = data.uid;
    handler.displayName = data.displayName;
    console.log(socket.id)
    Session.addUser(socket.id, data)
    init_game_RH();
}       

const game_update = (handler, data) => {

}

const game_input = (handler, data) => {
    //console.log({data})
    const {Session, uid} = handler;
    Session.updateTankInput(uid, data);
}

const game_spawn = (handler, type) => {
    const {Session, uid, displayName} = handler;
    Session.spawnTank({uid, type, displayName});

}

const game_fire = (handler) => {
    const {Session, uid} = handler;
    Session.fireProjectile(uid);
}

module.exports = {SocketRequestHandler};
