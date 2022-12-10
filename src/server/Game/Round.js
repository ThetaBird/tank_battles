/*
src/server/Game/Round.js
Round() defines a sub-game in one session. It contains data about the round type, expiry time,
current teams, leaderboards, etc.

Author: Max Jikharev
*/

const {Tank} = require("./Tank");

function Round(){
    this.Constants = {
        TYPE:null, //round type, i.e. ctf, ffa, td, elimnation, domination
        EXPIRES:null,


    }
    this.tanks = {};
    this.projectiles = [];
    this.stats = {}

    this.spawnTank = (data) => _spawnTank(this, data);
    this.updateTankInput = (uid, input) => _updateTankInput(this, uid, input);

    this.moveTanks = () => _moveTanks(this);
    this.moveProjectiles = () => _moveProjectiles(this);
    this.checkCollisions = () => _checkCollisions(this);
}

//Handle client socket requests
const _spawnTank = (round, {uid, type, displayName}) => round.tanks[uid] = new Tank(type, displayName); //TODO: Give initial x & y pos
const _updateTankInput = (round, uid, input) => round.tanks[uid].input = input;

const _moveTanks = (round) => Object.keys(round.tanks).forEach(uid => round.tanks[uid].updatePos())
const _moveProjectiles = (round) => round.projectiles.forEach(projectile => projectile.updatePos())
const _checkCollisions = (round) => {}

module.exports = {Round}