/*
src/server/Game/RoundController.js
RoundController object containing all functions & intervals for game rounds.
*/

const {Round} = require("./Round");
const Parameters = require("../../data");

function RoundController(io, sessionController){
    this.round = null;
    this.io = io;

    this.createRound = () => {return _createRound(this)}
}

const _createRound = (controller) => {
    controller.round = new Round();
    _initPhysics(controller);
    _initUpdates(controller);

    controller.round.spawnTank({uid:"dummy",displayName:"dummy",type:Parameters.TANK_TYPES.RECO})

    return controller.round;
}

const _initPhysics = (controller) => {
    const physicsLimit = 1000/30;
    setInterval(() => {
        const {round} = controller;
        round.moveTanks();
        round.moveProjectiles();
        round.checkCollisions();
    }, physicsLimit)
}

const _initUpdates = (controller) => {
    const updateLimit = 1000/60;
    setInterval(() => {
        const updateString = controller.round.getUpdate();
        if(updateString) controller.io.emit(Parameters.SOCKET_PROTOCOL_SND.GAME_DATA, updateString)
    }, updateLimit);
}

module.exports = {RoundController};