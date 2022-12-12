/*
src/server/Game/Round.js
Round() defines a sub-game in one session. It contains data about the round type, expiry time,
current teams, leaderboards, etc.

Author: Max Jikharev
*/

const { Projectile } = require("./Projectile");
const {Tank} = require("./Tank");
const Parameters = require('../../data');

function Round(){
    this.Constants = {
        TYPE:null, //round type, i.e. ctf, ffa, td, elimnation, domination
        EXPIRES:null,


    }
    this.tanks = {};
    this.deadTanks = [];
    this.projectiles = [];
    this.stats = {};

    this.updateString = "";

    this.spawnTank = (data) => _spawnTank(this, data);
    this.destroyTank = (uid) => _destroyTank(this, uid);
    this.updateTankInput = (uid, input) => _updateTankInput(this, uid, input);
    this.fireProjectile = (uid) => _fireProjectile(this, uid);

    this.moveTanks = () => _moveTanks(this);
    this.moveProjectiles = () => _moveProjectiles(this);
    this.checkCollisions = () => _checkCollisions(this);

    this.getUpdate = () => {return _getUpdate(this)};
    this.cleanCorpses = () => _cleanCorpses(this);
}

//Handle client socket requests
const _spawnTank = (round, {uid, type, did, displayName}) => {
    if(!round.tanks[uid]) round.tanks[uid] = new Tank(type, did, displayName);
} //TODO: Give initial x & y pos

const _destroyTank = (round, uid) => {
    if(!round.tanks[uid]) return;
    const {pos} = round.tanks[uid];
    round.deadTanks.push({ pos, t:Date.now()});
    delete round.tanks[uid];
}

const _updateTankInput = (round, uid, input) => {
    if(!round.tanks[uid]) return;
    round.tanks[uid].input = input;
}

const _fireProjectile = (round, uid) => {
    if(!round.tanks[uid]) return;
    const projectileData = round.tanks[uid].spawnProjectile();
    if(projectileData) round.projectiles.push(new Projectile(uid, projectileData))
}


const _moveTanks = (round) => {
    Object.keys(round.tanks).forEach(uid => {
        
        const tank = round.tanks[uid];
        const alive = tank.updatePos();

        if(!alive) round.destroyTank(uid)
    })

}
const _moveProjectiles = (round) => {
    round.projectiles.forEach(projectile => projectile.updatePos());
    round.projectiles = round.projectiles.filter(projectile => !projectile.delete);
}

const __checkTankBodyCollision = (round) => {
    Object.keys(round.tanks).forEach(uid => {
        const tank = round.tanks[uid];
        round.deadTanks.forEach(dead => {
            if(estimateDistanceThreshold(dead, tank, 6) && distance(dead, tank) < 4){
                tank.meta.momentum = (tank.meta.momentum) * -1.1;
            }
        })

        Object.keys(round.tanks).forEach(uid2 => {
            const tank2 = round.tanks[uid2];
            if(uid != uid2 && estimateDistanceThreshold(tank2, tank, 6) && distance(tank2, tank) < 4){
                tank.meta.momentum = (tank.meta.momentum) * -1.1;
            }
        })
    })
}

const _checkCollisions = (round) => {
    let removeProjectileIDs = [];
    round.projectiles.forEach(projectile => {
        //Check collisions with active tanks
        Object.keys(round.tanks).forEach(uid => { 
            const tank = round.tanks[uid];
            if(projectile.uid != uid && estimateDistanceThreshold(tank, projectile, 5) && distance(tank, projectile) < 2.5){
                tank.removeHealth(50);
                removeProjectileIDs.push(projectile.id);
            }
        })

        //Check collisions with dead tanks
        round.deadTanks.forEach(tank => {
            if(!removeProjectileIDs.includes(projectile.id) 
                && estimateDistanceThreshold(tank, projectile, 5) 
                && distance(tank, projectile) < 2.5){
                    
                removeProjectileIDs.push(projectile.id);
            }
        })
        
    })
    round.projectiles = round.projectiles.filter(projectile => !removeProjectileIDs.includes(projectile.id));
    __checkTankBodyCollision(round);
    
}

const _getUpdate = (round) => {
    const {tanks, projectiles, stats} = round;

    const tankUpdateObj = [...round.deadTanks];
    Object.keys(tanks).forEach(key => {
        const {displayName, did ,team, pos, health, color} = tanks[key];
        tankUpdateObj.push({displayName, did ,team, pos, health, color});
    })

    const projectileUpdateObj = [];
    Object.keys(projectiles).forEach(key => {
        const {x,y,t,id} = projectiles[key];
        projectileUpdateObj.push({x,y,t,id});
    })

    //console.log(tankUpdateObj);

    const newUpdateString = JSON.stringify({tanks:tankUpdateObj, projectiles:projectileUpdateObj, stats})
    if(round.updateString == newUpdateString) return false;
    
    round.updateString = newUpdateString;
    return newUpdateString;
}

const _cleanCorpses = (round) => {
    let now = Date.now();
    round.deadTanks = round.deadTanks.filter(tank => now - tank.t < Parameters.CORPSE_EXPIRY)
}

module.exports = {Round}

const estimateDistanceThreshold = (o1, o2, threshold) => {
    const o1pos = o1.pos || {x:o1.x, y:o1.y};
    const o2pos = o2.pos || {x:o2.x, y:o2.y};

    const dx = o1pos.x - o2pos.x;
    const dy = o1pos.y - o2pos.y;

    return (Math.abs(dx) + Math.abs(dy)) < threshold;
}
const distance = (o1, o2) => {
    const o1pos = o1.pos || {x:o1.x, y:o1.y};
    const o2pos = o2.pos || {x:o2.x, y:o2.y};

    const dx = o1pos.x - o2pos.x;
    const dy = o1pos.y - o2pos.y;
    return Math.sqrt(dx * dx + dy * dy);
}