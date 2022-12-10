/*
src/server/Game/Tank.js
Player Object for tank & team assignments.

Author: Max Jikharev
*/

function Tank(){
    this.displayName = null;
    this.type = {
        UID:0,
        HLT:0,
        SPD:0,
        DMG:0,
        RNG:0,
        RLD:0,
        RTS:0,
    };
    this.health = 0;
    this.lastProjectile = new Date();

    this.pos = {
        x:null,
        y:null,
        theta_turret:null,
        theta_tank:null,
    };
    
    this.input = {
        w:0, //up
        s:0, //down
        a:0, //left
        d:0, //right
        m:0, //mouse angle
    }
}

/*
void Tank.prototype.updatePos()
Runs on every physics cycle, updates tank pos based on perceived user input.
*/
Tank.prototype.updatePos = () => {
    const {w, s, d, a, m} = this.input;
    const {theta_turret, theta_tank} = this.pos;
    const {SPD, RTS} = this.type;

    const forward = w - s;
    const rotate_tank = d - a;
    const rotate_turret = theta_turret - m;

    if(forward){
        this.pos.x += SPD * Math.sin(theta_tank);
        this.pos.y -= SPD * Math.cos(theta_tank);
    }
    if(rotate_tank){
        const max_tank_rotate = 10*RTS * (theta_tank > 0 ? 1 : -1);
        this.pos.theta_tank += max_tank_rotate;
    }
    if(rotate_turret){

    }
}

/*
bool Tank.prototype.removeHealth(int amt)
Runs when physics engine determines a hit, deducts a defined amount from tank health.
Returns false if health remains above 0, true otherwise.
*/
Tank.prototype.removeHealth = (amt) => {
    this.health -= amt;
    return (health <= 0);
}

/*
any Tank.prototype.spawnProjectile()
Runs when client requests to shoot. Checks if reload cooldown is active.
Returns false if cooldown active, {x, y, theta_turret, DMG} otherwise.
*/
Tank.prototype.spawnProjectile = () => {
    const {RLD, DMG} = this.type;
    if(RLD > Date.now() - this.lastProjectile) return false;

    const {x, y, theta_turret} = this.pos;
    return {x, y, theta_turret, DMG};
}

module.exports = {Tank}