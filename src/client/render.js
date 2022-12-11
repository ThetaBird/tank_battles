const THREE = require('three');
const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader') 
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls') 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#tank_battles'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const geometry = new THREE.PlaneGeometry( 1, 1 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, planeMaterial );

scene.add( plane );


const testGeometry = new THREE.BoxGeometry(2.5,1,1);
const turretGeometry = new THREE.BoxGeometry(1,10,1);
const bulletGeometry = new THREE.SphereGeometry(0.1, 20, 20);

const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const grey_material = new THREE.MeshStandardMaterial({color: 0x333333});
const white_material = new THREE.MeshStandardMaterial({color: 0xcccccc});
//const mesh = new THREE.Mesh(testGeometry, material);

const pointLight = new THREE.PointLight(0xffccff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xccffcc);

const objLoader = new OBJLoader();
const tankObjects = {};

objLoader.load(
    'resources/test.obj',
    (object) => {
        // (object.children[0] as THREE.Mesh).material = material
        object.traverse(function (child) {
            console.log(child)
            if(child.type != "Mesh") return;
            if(["Body1","Body2"].includes(child.name)) child.material = grey_material;
            else if(["Body3"].includes(child.name)) child.material = white_material;
            else child.material = material;
        })
        
        object.scale.setScalar(0.02);
        tankObjects.RECO = object;
    }
)


//scene.add(mesh);
scene.add(pointLight, ambientLight);


let addedTanks = [];
let addedProjectiles = [];

const upsertObjects = (data, displayName) => {
    const {tanks, projectiles} = data;

    const me = tanks.find(tank => tank.displayName == displayName);
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
            tank.body = tankObjects.RECO.clone()//new THREE.Mesh(testGeometry, material);
            //tank.turret = new THREE.Mesh(turretGeometry, grey_material);

            const group = new THREE.Group();
            group.add(tank.body)
            //group.add(tank.turret);

            tank.group = group;

            addedTank = tank;
            addedTanks.push(tank);

            scene.add(group);   
        }
        
        const {group, body, turret} = addedTank;

        group.position.setX(x - tank.pos.x);
        group.position.setY(y - tank.pos.y);
        
        plane.position.setX(tank.pos.x);
        plane.position.setY(tank.pos.y);

        body.rotation.z = tank.pos.theta_tank * -1;
       // turret.rotation.z = tank.pos.theta_turret * -1;

        
    }
}



const upsertProjectiles = (projectiles, x, y) => {
    //console.log(projectiles);
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
    controls.update()
    renderer.render(scene, camera);
}

animate();

module.exports = {upsertObjects};