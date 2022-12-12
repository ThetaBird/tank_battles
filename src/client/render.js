const THREE = require('three');
const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader') 
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls'); 
const TextSprite = require('@seregpie/three.text-sprite');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#tank_battles'),
})
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);


let controls; 


const loader = new THREE.TextureLoader();
const texture = loader.load('resources/back.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = 300/10;
texture.repeat.set(repeats, repeats);

const geometry = new THREE.PlaneGeometry( 300, 300 );
const planeMat = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

const boundsgeometry = new THREE.PlaneGeometry( 500, 500 );
const boundsplaneMaterial = new THREE.MeshBasicMaterial( {color: 0x555555, side: THREE.DoubleSide} );

const plane = new THREE.Mesh( geometry, planeMat );
const boundsplane = new THREE.Mesh( boundsgeometry, boundsplaneMaterial );

const environment = new THREE.Group();
environment.add(plane);
environment.add(boundsplane);

scene.add( environment );

boundsplane.position.setZ(-0.1);

const bulletGeometry = new THREE.SphereGeometry(0.2, 20, 20);

const material = new THREE.MeshStandardMaterial({color: 0xff6347});
const material2 = new THREE.MeshStandardMaterial({color: 0xcccccc});
const grey_material = new THREE.MeshStandardMaterial({color: 0x333333});
const white_material = new THREE.MeshStandardMaterial({color: 0xcccccc});
//const mesh = new THREE.Mesh(testGeometry, material);

let playerColors = {}

const pointLight = new THREE.PointLight(0xffccff,1,50);
pointLight.position.set(20, 20, 2);

const ambientLight = new THREE.AmbientLight(0xcccccc);

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

function enableOrbit(){
    controls = new OrbitControls(camera, renderer.domElement);
    return false
}

const createText = (text, health) => {
    const nameText = new TextSprite({
        alignment: 'left',
        color: '#1c1c1c',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: 1,
        fontStyle: 'bold',
        text
      });

    const healthText = new TextSprite({
        alignment: 'left',
        color: '#1c1c1c',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: 1,
        fontStyle: 'bold',
        text:`${health}`
      });

    return {nameText, healthText}
}

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


//scene.add(mesh);
scene.add(pointLight, ambientLight);



let allTanks = {
    RECO:[],
    DEAD:[]    
}

let addedProjectiles = [];

let lastCoords = {
    x:0,
    y:0
}
const upsertObjects = (data, did) => {
    const {tanks, projectiles} = data;

    const me = tanks.find(tank => tank.did == did);

    if(me){
        const {x,y} = me.pos;
        lastCoords.x = x; lastCoords.y = y;
    }
    

    upsertTanks(tanks, lastCoords);
    upsertProjectiles(projectiles, lastCoords);
}

const setTurretColor = (turret, color) => {

    const mat = playerColors[color] || new THREE.MeshStandardMaterial({color});
    if(!playerColors[color]) playerColors[color] = material;
    turret.children[1].material = mat;
}

const upsertTanks = (tanks, {x, y}) => {
    //console.log(tanks)
    const expiredTanks = allTanks.RECO.filter(t => !tanks.find(_t => _t.did == t.did));
    expiredTanks.forEach(t => {
        scene.remove(t.group);
        scene.remove(t.textGroup);
    })
    allTanks.RECO = allTanks.RECO.filter(t => tanks.find(_t => _t.did == t.did));

    const expiredDeadTanks = allTanks.DEAD.filter(t => !tanks.find(_t => _t.t == t.t));
    expiredDeadTanks.forEach(t => {
        scene.remove(t.group);
    })
    allTanks.DEAD = allTanks.DEAD.filter(t => tanks.find(_t => _t.t == t.t));


    let addedTank;
    for(const tank of tanks){
        let tankType;
        if(tank.t){ //dead tank
            tankType = "DEAD";
            addedTank = allTanks.DEAD.find(deadT => (deadT.t == tank.t));
        }else{
            tankType = "RECO";
            addedTank = allTanks.RECO.find(addedT => (addedT.did == tank.did));
        }
        
        if(!addedTank){
            tank.object = {
                body: tankObjects[tankType].body.clone(),
                turret: tankObjects[tankType].turret.clone(),
            };

            if(!tank.t) {
                tank.text = createText(tank.displayName, tank.health)
                const textGroup = new THREE.Group();
                textGroup.add(tank.text.nameText);
                textGroup.add(tank.text.healthText);

                tank.textGroup = textGroup;
                scene.add(textGroup);   
            }

            setTurretColor(tank.object.turret, tank.color)

            const group = new THREE.Group();
            group.add(tank.object.body)
            group.add(tank.object.turret);

            

            tank.group = group;

            addedTank = tank;
            allTanks[tankType].push(tank);

            scene.add(group);   
        }
        
        const {group, object, textGroup} = addedTank;

        if(textGroup){
            textGroup.position.setX(x - tank.pos.x);
            textGroup.position.setY(y - tank.pos.y - 3);

            textGroup.children[1].position.setY(-1);
            textGroup.children[1].text = `${tank.health}`;
        }
        

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
    if(controls) controls.update()
    renderer.render(scene, camera);
}

animate();

module.exports = {upsertObjects, enableOrbit};