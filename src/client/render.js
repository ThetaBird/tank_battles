const THREE = require('three');
const { arraySlice } = require('three/src/animation/AnimationUtils');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#tank_battles'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const testGeometry = new THREE.BoxGeometry(2.5,1,1);
const turretGeometry = new THREE.BoxGeometry(1,10,1);
const bulletGeometry = new THREE.SphereGeometry(0.1, 20, 20);

const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const grey_material = new THREE.MeshStandardMaterial({color: 0x333333});
//const mesh = new THREE.Mesh(testGeometry, material);

const pointLight = new THREE.PointLight(0xffccff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xccffcc);


//scene.add(mesh);
scene.add(pointLight, ambientLight);


let addedTanks = [];
let addedProjectiles = [];

const upsertObjects = (data, displayName) => {
    const {tanks, projectiles} = data;

    const me = tanks[0]//.find(tank => tank.displayName == displayName);
    if(!me) return;
    const {x,y} = me.pos;

    upsertTanks(tanks, x, y);
    upsertProjectiles(projectiles, x, y);
}

const upsertTanks = (tanks, x, y) => {
    for(const tank of tanks){
        //console.log(tank.pos.theta_turret);
        let addedTank = addedTanks.find(addedT => addedT.displayName == tank.displayName);
        if(!addedTank){
            tank.body = new THREE.Mesh(testGeometry, material);
            tank.turret = new THREE.Mesh(turretGeometry, grey_material);

            addedTank = tank;
            addedTanks.push(tank);
            scene.add(tank.body);
            scene.add(tank.turret);
        }
        
        const {body, turret} = addedTank;

        body.position.setX(x - tank.pos.x);
        body.position.setY(y - tank.pos.y);
        body.rotation.z = tank.pos.theta_tank * -1;

        turret.position.setX(x - tank.pos.x);
        turret.position.setY(y - tank.pos.y);
        turret.rotation.z = tank.pos.theta_turret * -1;

        
    }
}



const upsertProjectiles = (projectiles, x, y) => {
    console.log(projectiles);
    const expiredProjectiles = addedProjectiles.filter(p => !projectiles.find(_p => _p.id == p.id));
    expiredProjectiles.forEach(p => scene.remove(p.body))

    addedProjectiles = addedProjectiles.filter(p => projectiles.find(_p => _p.id == p.id));

    for(const projectile of projectiles){
        let addedProjectile = addedProjectiles.find(addedP => addedP.id == projectile.id);
        if(!addedProjectile){
            const body = new THREE.Mesh(bulletGeometry, material);
            projectile.body = body;
            addedProjectile = projectile;
            addedProjectiles.push(addedProjectile)
            scene.add(body);
            //addedProjectiles.body.rotation.x = projectile.t;
        }

        addedProjectile.body.position.setX(x - projectile.x);
        addedProjectile.body.position.setY(y - projectile.y);
    }
}

const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

module.exports = {upsertObjects};