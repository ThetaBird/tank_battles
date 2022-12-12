const THREE = require('three');
const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader') 
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls'); 

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

const geometry = new THREE.PlaneGeometry( 100, 100 );
const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide} );

const boundsgeometry = new THREE.PlaneGeometry( 150, 150 );
const boundsplaneMaterial = new THREE.MeshBasicMaterial( {color: 0x555555, side: THREE.DoubleSide} );

const plane = new THREE.Mesh( geometry, planeMaterial );
const boundsplane = new THREE.Mesh( boundsgeometry, boundsplaneMaterial );

const environment = new THREE.Group();
environment.add(plane);
environment.add(boundsplane);

scene.add( environment );

boundsplane.position.setZ(-0.01);

const bulletGeometry = new THREE.SphereGeometry(0.2, 20, 20);

const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const material2 = new THREE.MeshStandardMaterial({color: 0xcccccc});
const grey_material = new THREE.MeshStandardMaterial({color: 0x333333});
const white_material = new THREE.MeshStandardMaterial({color: 0xcccccc});
//const mesh = new THREE.Mesh(testGeometry, material);

const pointLight = new THREE.PointLight(0xffccff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xccffcc);

const objLoader = new OBJLoader();
const tankObjects = {
    RECO:{
        body:null,
        turret:null,
    },
    DEAD:{
        body:null,
        turret:null,
    }
};


async function loadOBJ(path,type){
    objLoader.load(
        path,
        (object) => {
            object.scale.setScalar(0.02);
            const deadObject = object.clone();

            object.traverse(function (child) {
                console.log(child)
                if(child.type != "Mesh") return;
                
                if(["Body1","Body2"].includes(child.name)) {child.material = grey_material;}
                else if(["Body3"].includes(child.name)) {child.material = material2;}
                else {child.material = material;}
    
                
            })
            
            tankObjects.RECO[type] = object;

            
            deadObject.traverse(function (child) {
                if(child.type != "Mesh") return;
                child.material = grey_material;
            })
            tankObjects.DEAD[type] = deadObject;
            
        }
    )
}

loadOBJ('/resources/testBody.obj',"body")
loadOBJ('/resources/testTurret.obj',"turret")


console.log(tankObjects.RECO);

//scene.add(mesh);
scene.add(pointLight, ambientLight);


let addedTanks = [];
let deadTanks = [];

let allTanks = {
    RECO:[],
    DEAD:[]    
}

let addedProjectiles = [];

let lastCoords = {
    x:0,
    y:0
}
const upsertObjects = (data, displayName) => {
    const {tanks, projectiles} = data;

    const me = tanks.find(tank => tank.displayName == displayName);

    if(me){
        const {x,y} = me.pos;
        lastCoords.x = x; lastCoords.y = y;
    }
    

    upsertTanks(tanks, lastCoords);
    upsertProjectiles(projectiles, lastCoords);
}

const upsertTanks = (tanks, {x, y}) => {
    const expiredTanks = allTanks.RECO.filter(t => !tanks.find(_t => _t.displayName == t.displayName));
    expiredTanks.forEach(t => {
        scene.remove(t.group);
        //scene.remove(t.object.body);
    })
    allTanks.RECO = allTanks.RECO.filter(t => tanks.find(_t => _t.displayName == t.displayName));

    let addedTank;
    for(const tank of tanks){
        let tankType;
        console.log(tank.displayName)
        if(tank.displayName.startsWith("_")){ //dead tank
            tankType = "DEAD";
            addedTank = [...allTanks.DEAD].reverse().find(deadT => (deadT.displayName == tank.displayName));
        }else{
            tankType = "RECO";
            addedTank = allTanks.RECO.find(addedT => (addedT.displayName == tank.displayName));
        }

        
        if(!addedTank){
            tank.object = {
                body: tankObjects[tankType].body.clone(),
                turret: tankObjects[tankType].turret.clone(),
            };

            const group = new THREE.Group();
            group.add(tank.object.body)
            group.add(tank.object.turret);

            tank.group = group;

            addedTank = tank;
            allTanks[tankType].push(tank);

            scene.add(group);   
        }
        
        const {group, object} = addedTank;

        group.position.setX(x - tank.pos.x);
        group.position.setY(y - tank.pos.y);
        
        environment.position.setX(x);
        environment.position.setY(y);

        object.body.rotation.z = tank.pos.theta_tank * -1;
        object.turret.rotation.z = tank.pos.theta_turret * -1 + Math.PI;

        
    }
}



const upsertProjectiles = (projectiles, {x, y}) => {
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
        addedProjectile.body.position.set(x - projectile.x, y - projectile.y, 1);
    }
}

const animate = () => {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}

animate();

module.exports = {upsertObjects};