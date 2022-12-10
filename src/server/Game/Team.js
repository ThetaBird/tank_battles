/*
src/server/Game/Team.js
Team object containing all players for the round.

Author: Max Jikharev
*/

function Team(){
    this.players = [];
    this.color = null;

    this.addPlayer = (player) => _addPlayer(this, player) 
    this.removePlayer = (player) => _removePlayer(this, player) 
    this.setColor = (color) => _setColor(this, color) 
}

const _addPlayer = (team, player) => {

}

const _removePlayer = (team, player) => {

}

const _setColor = (team, color) => {

}

module.exports = {Team};