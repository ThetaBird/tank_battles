/*
src/server/Game/Tank.js
Player Object for tank & team assignments.

Author: Max Jikharev
*/

const Parameters = require('../../data');
const radians = Math.PI * 2;
const radian = Math.PI;
const minRadians = radians/4;
const maxRadians = radians - minRadians;

function Tank(type, displayName){
    console.log({type});
    this.displayName = displayName;
    this.constants = Parameters.TANK_CONSTANTS[type];
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

    this.pos = {
        x:0,
        y:0,
        theta_turret:0,
        theta_tank:0,
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
    const {w, s, d, a, m} = tank.input;
    const {theta_turret, theta_tank} = tank.pos;
    const {SPD, RTS} = tank.constants;

    const forward = w - s;
    const rotate_tank = d - a;
    const rotate_turret = m - theta_turret;

    if(forward){
        //These values don't seem to be behaving correctly, TODO: fix
        tank.pos.x += SPD * Math.sin(theta_tank) * (forward > 0 ? -1 : 1);
        tank.pos.y -= SPD * Math.cos(theta_tank) * (forward > 0 ? 1 : -1);
    }
    if(rotate_tank){
        const max_tank_rotate = RTS * (rotate_tank > 0 ? 1 : -1);
        let final_val = theta_tank + max_tank_rotate;
        if(final_val >= radian){final_val -= radians}
        else if(final_val < radian * -1 ){final_val += radians}
        tank.pos.theta_tank = final_val;
        console.log(theta_tank)
    }
   
    if(rotate_turret){
        if(rotate_turret > 0){tank.pos.theta_turret += Math.min(rotate_turret, RTS);
        }else{tank.pos.theta_turret += Math.max(rotate_turret, RTS * -1);}

        tank.pos.theta_turret = tank.pos.theta_turret.clamp(minRadians + theta_tank, maxRadians + theta_tank);
    }
   
}

/*
bool Tank.prototype.removeHealth(int amt)
Runs when physics engine determines a hit, deducts a defined amount from tank health.
Returns false if health remains above 0, true otherwise.
*/
const _removeHealth = (tank, amt) => {
    tank.health -= amt;
    return (health <= 0);
}

/*
any Tank.prototype.spawnProjectile()
Runs when client requests to shoot. Checks if reload cooldown is active.
Returns false if cooldown active, {x, y, theta_turret, DMG} otherwise.
*/
const _spawnProjectile = (tank) => {
    const {RLD, DMG, RNG} = tank.constants;
    if(RLD > (Date.now() - tank.lastProjectile)) return false;
    tank.lastProjectile = Date.now();
    const {x, y, theta_turret} = tank.pos;
    return {x, y, t:theta_turret, d:DMG, r:RNG};
}

module.exports = {Tank}