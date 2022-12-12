let counter = 1;

function Projectile(uid, data){
    //Player
    this.uid = uid;
    this.id = counter++;

    const {x,y,t,d,r} = data;

    this.x = x;
    this.y = y;

    this.t = t; //theta
    this.d = d; //dmg
    this.r = r; //range

    this.delete = false;

    this.xIncrement = Math.sin(t) * d * .05;
    this.yIncrement = Math.cos(t) * d * .05;

    //For future anti-friendly-fire functionality
    //this.team = 0;

    this.updatePos = () => _updatePos(this)
}

/*
void Projectile.prototype.updatePos()
Runs on every physics cycle, updates projectile pos and checks range.
*/ 
const _updatePos = (projectile) => {
    projectile.x += projectile.xIncrement;
    projectile.y += projectile.yIncrement;

    projectile.r -= 1;
    if(projectile.r <= 0) projectile.delete = true;
}

module.exports = {Projectile}