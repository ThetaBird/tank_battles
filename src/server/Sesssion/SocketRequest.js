const Parameters = require('../../data');
const {getGoogleUser} = require('../Google/OAuth');


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

const join_game = async (handler, data) => {
    const {Session, socket, init_game_RH} = handler;
    const code = data.code;
    let user;
    try{user = await getGoogleUser({code})}catch(e){}

    if(!user) return handler.socket.emit(Parameters.SOCKET_PROTOCOL_SND.UNAUTH)

    data.uid = user.id;
    handler.displayName = data.displayName;
    handler.uid = data.uid;
    
    Session.addUser(socket.id, data)
    init_game_RH();

    handler.socket.emit(Parameters.SOCKET_PROTOCOL_SND.AUTH);
}       

const game_update = (handler, data) => {

}

const game_input = (handler, data) => {
    //console.log({data})
    const {Session, uid} = handler;
    Session.updateTankInput(uid, data);
}

const game_spawn = (handler, type) => {
    console.log("SPAWN")
    const {Session, uid, displayName} = handler;
    Session.spawnTank({uid, type, displayName});

}

const game_fire = (handler) => {
    const {Session, uid} = handler;
    Session.fireProjectile(uid);
}

module.exports = {SocketRequestHandler};
