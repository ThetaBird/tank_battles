/*
src/server/Game/Tank.js
Player Object for tank & team assignments.

Author: Max Jikharev
*/

const Parameters = require('../../data');
const radians = Math.PI * 2;
const radian = Math.PI;

const MAP_SIZE = 150;//distance from center to edge

function Tank(type, did, displayName){
    this.displayName = displayName;
    this.constants = Parameters.TANK_CONSTANTS[type];
    this.did = did || Date.now();

    if(!this.constants) return;
    /*
    {
        UID:0,
        HLT:0,
        SPD:0,
        DMG:0,
        RNG:0,
        RLD:0,
        RTS:0,
    };*/

    this.health = this.constants.HLT;
    this.lastProjectile = new Date();
    this.color = `#${Math.floor(Math.random()*16777215).toString(16)}`,

    this.pos = {
        x:Math.random() * 200 - 100,
        y:Math.random() * 200 - 100,
        theta_turret:0,
        theta_tank:0,
    };
    
    this.meta = {
        momentum:0,
        dead:false,
    };

    this.input = {
        w:0, //up
        s:0, //down
        a:0, //left
        d:0, //right
        m:0, //mouse angle
    }

    this.updatePos = () => _updatePos(this)
    this.removeHealth = (amt) => _removeHealth(this, amt)
    this.spawnProjectile = () => _spawnProjectile(this)
}

/*
void Tank.prototype.updatePos()
Runs on every physics cycle, updates tank pos based on perceived user input.
*/
const _updatePos = (tank) => {
    if(!tank || !tank.input || !tank.pos) return false;

    const {w, s, d, a, m} = tank.input;
    const {theta_turret, theta_tank} = tank.pos;
    const {SPD, RTS} = tank.constants;
    const {meta} = tank;

    if(meta.dead) return false;

    const forward = w - s;
    meta.momentum = forward ? clamp(0.05 * forward + meta.momentum, -1, 1) : parseFloat((meta.momentum/1.15).toPrecision(2));
    
    const rotate_tank = d - a;
    let rotate_turret = m - theta_turret;

    
    if(parseInt(Math.abs(meta.momentum) + 0.9) || forward){
        tank.pos.x += -1 * SPD * Math.sin(theta_tank) * meta.momentum;
        tank.pos.y -= SPD * Math.cos(theta_tank) * meta.momentum;
    }
    
    if(rotate_tank){
        const max_tank_rotate = RTS * (rotate_tank > 0 ? 1 : -1);
        let final_val = theta_tank + max_tank_rotate;
        if(final_val >= radian){final_val -= radians}
        else if(final_val < radian * -1 ){final_val += radians}
        tank.pos.theta_tank = final_val;
        rotate_turret += max_tank_rotate;
    }
    /*
    if(rotate_turret){
        const [d1, d2] = [m - theta_turret, radians - theta_turret + m].sort((a,b) => Math.abs(a) - Math.abs(b));
        const rt = d1;

        if(rt > 0){tank.pos.theta_turret += Math.min(rt, (RTS + .1));
        }else{tank.pos.theta_turret += Math.max(rt, (RTS + .1) * -1);}
        
        if(tank.pos.theta_turret > radians) tank.pos.theta_turret -= radians;
        else if(tank.pos.theta_turret < 0) tank.pos.theta_turret += radians;
    }*/

    if(rotate_turret){
        let [d1, d2] = [];
  
        if(Math.abs(rotate_turret) > radian){
            [d1, d2] = [theta_turret - m, m - radians + theta_turret].sort((a,b) => Math.abs(a) - Math.abs(b));
        }else{
            [d1, d2] = [m - theta_turret, radians - theta_turret + m].sort((a,b) => Math.abs(a) - Math.abs(b));
        }
        const rt = d1;

        if(rt > 0){tank.pos.theta_turret += Math.min(rt, (RTS + .1));
        }else{tank.pos.theta_turret += Math.max(rt, (RTS + .1) * -1);}
        
        if(tank.pos.theta_turret > radians) tank.pos.theta_turret -= radians;
        else if(tank.pos.theta_turret < 0) tank.pos.theta_turret += radians;
    }
    
    if(Math.abs(tank.pos.x) > MAP_SIZE || Math.abs(tank.pos.y) > MAP_SIZE) return tank.removeHealth(1);
    return true;
}

/*
bool Tank.prototype.removeHealth(int amt)
Runs when physics engine determines a hit, deducts a defined amount from tank health.
Returns false if health remains above 0, true otherwise.
*/
const _removeHealth = (tank, amt) => {
    tank.health -= amt;
    if(tank.health <= 0 && !tank.meta.dead){tank.meta.dead = true; return false;}
    return true;
}

/*
any Tank.prototype.spawnProjectile()
Runs when client requests to shoot. Checks if reload cooldown is active.
Returns false if cooldown active, {x, y, theta_turret, DMG} otherwise.
*/
const _spawnProjectile = (tank) => {
    if(tank.meta.dead) return false;
    const {RLD, DMG, RNG} = tank.constants;
    if(RLD > (Date.now() - tank.lastProjectile)) return false;
    tank.lastProjectile = Date.now();
    const {x, y, theta_turret} = tank.pos;
    return {x, y, t:theta_turret, d:DMG, r:RNG};
}

module.exports = {Tank}

const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}