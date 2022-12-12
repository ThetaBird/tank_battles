const Parameters = require('../../data');
const {getGoogleUser} = require('../Google/OAuth');


function SocketRequestHandler(socket, Session){
    this.socket = socket;
    this.Session = Session;
    this.uid = null;
    this.did = null;
    this.displayName = null;

    const {JOIN_GAME, GAME_UPDATE, USER_INPUT, SPAWN, FIRE, DISCONNECT} = Parameters.SOCKET_PROTOCOL_RCV;

    socket.on(JOIN_GAME, (data) => join_game(this, data));
    

    this.init_game_RH = () => {
        socket.on(GAME_UPDATE, (data) => game_update(this, data));
        socket.on(USER_INPUT, (data) => game_input(this, data));
        socket.on(SPAWN, (data) => game_spawn(this, data));
        socket.on(FIRE, () => game_fire(this));
        socket.on(DISCONNECT, () => game_disconnect(this));
    }
}

const join_game = async (handler, data) => {
    const {Session, socket, init_game_RH} = handler;
    const code = data.code;
    let user;
    try{user = await getGoogleUser({code})}catch(e){}

    //if(!user) return handler.socket.emit(Parameters.SOCKET_PROTOCOL_SND.UNAUTH)
    if(!user) {
        data.uid = `${parseInt(Math.random() * 10000000) + Date.now()}`;
        data.displayName= "Guest";
        
        handler.displayName = data.displayName;
    }else{
        data.uid = user.id;
        data.displayName = user.given_name;
        handler.displayName = user.given_name;
    }

   
    
    handler.uid = data.uid;
    handler.did = data.did;
    
    Session.addUser(socket.id, data)
    init_game_RH();

    handler.socket.emit(Parameters.SOCKET_PROTOCOL_SND.AUTH);
}       

const game_update = (handler, data) => {

}

const game_input = (handler, data) => {
    const {Session, uid} = handler;
    Session.updateTankInput(uid, data);
}

const game_spawn = (handler, type) => {
    const {Session, uid, displayName, did} = handler;
    Session.spawnTank({uid, type, displayName, did});
}

const game_fire = (handler) => {
    const {Session, uid} = handler;
    Session.fireProjectile(uid);
}

const game_disconnect = (handler) => {
    const {Session, uid} = handler;
    Session.destroyTank(uid);
}

module.exports = {SocketRequestHandler};
