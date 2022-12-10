/*
src/server/Game/RoundController.js
RoundController object containing all functions & intervals for game rounds.
*/

const { Round } = require("./Round");

function RoundController(){
    this.round = null;

    this.createRound = () => {return _createRound(this)}
}

const _createRound = (controller) => {
    controller.round = new Round();
    _initPhysics(controller);

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

module.exports = {RoundController};