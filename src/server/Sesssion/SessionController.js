/*
src/server/Session/SessionController.js
There are multiple rounds per session.
Session() keeps track of all active players.

Author: Max Jikharev
*/

const {RoundController} = require("../Game/RoundController");

function SessionController(io){
    this.roundController = new RoundController(io);
    this.round = null;

    this.users = {};
    this.teams = {a:[],b:[],}

    this.createRound = () => this.round = this.roundController.createRound();

    this.addUser = (id, data) => _addUser(this, id, data);
    this.findUserFromSocketId = (socket) => _findUserFromSocketId(this, socket);

    this.spawnTank = (data) => _spawnTank(this, data);
    this.updateTankInput = (uid, data) => _updateTankInput(this, uid, data);
    this.fireProjectile = (uid) => _fireProjectile(this, uid); 
    this.destroyTank = (uid) => _destroyTank(this, uid);
}

//Add user data to memory. Used to keep track of display
const _addUser = (controller, id, data) => {
    const {uid, did, displayName} = data;

    controller.users[uid] = {
        socket:id,
        displayName,
        did,
        k:0,
        d:0,
        a:0,
    }
    console.log(controller.users);
    //append to team if not already in one
    const {a,b} = controller.teams;
    if(a.includes(uid) || b.includes(uid)) return;
    if(a.length > b.length) return controller.teams.b.push(uid);
    return controller.teams.a.push(uid);
}

const _findUserFromSocketId = (controller, socket) => controller.users.find(user => user.socket == socket);

//Methods for handling incoming client socket requests
const _spawnTank = (controller, data) => controller.round.spawnTank(data);
const _updateTankInput = (controller, uid, data) => controller.round.updateTankInput(uid, data);
const _fireProjectile = (controller, uid) => controller.round.fireProjectile(uid);
const _destroyTank = (controller, uid) => controller.round.destroyTank(uid);

module.exports = {SessionController}