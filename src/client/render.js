const THREE = require('three');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#tank_battles'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const testGeometry = new THREE.BoxGeometry(2.5,1,1.5);
const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const mesh = new THREE.Mesh(testGeometry, material);

const pointLight = new THREE.PointLight(0xffccff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xccffcc);


scene.add(mesh);
scene.add(pointLight, ambientLight);

const addedTanks = [];

const upsertObjects = (data, displayName) => {
    const {tanks} = data;
    upsertTanks(tanks, displayName);
}

const upsertTanks = (tanks, displayName) => {
    console.log({tanks})
    const me = tanks[0]//.find(tank => tank.displayName == displayName);
    if(!me) return;
    
    for(const tank of tanks){
        //console.log(tank.pos.theta_turret);
        let addedTank = addedTanks.find(addedT => addedT.displayName == tank.displayName);
        if(!addedTank){
            const body = new THREE.Mesh(testGeometry, material);
            tank.body = body;
            addedTank = tank;
            addedTanks.push(tank);
            scene.add(body);
        }
        
        addedTank.body.position.setX(tank.pos.x - me.pos.x);
        addedTank.body.position.setY(tank.pos.y - me.pos.y);
        addedTank.body.rotation.z = tank.pos.theta_turret * -1;
    }
}

const animate = () => {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();

module.exports = {upsertObjects};