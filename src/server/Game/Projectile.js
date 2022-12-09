function Projectile(){
    //Player
    this.player = null;

    this.x = null;
    this.y = null;

    this.t = null; //theta
    this.d = null; //dmg

    //For future anti-friendly-fire functionality
    //this.team = 0;
}

/*
void Projectile.prototype.updatePos()
Runs on every physics cycle, updates projectile pos.
*/ 
Projectile.prototype.updatePos = () => {

}

module.exports = {Projectile}