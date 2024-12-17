import './style.css';
import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();
let clock = new THREE.Clock();
let delta=0;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(7);
camera.position.setY(1);
camera.position.setX(0);
renderer.render(scene, camera);

/*background 
const backGround= new THREE.TextureLoader().load('bg.jpg');
scene.background= backGround;
*/

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth,window.innerHeight);
labelRenderer.domElement.style.position= 'absolute';
labelRenderer.domElement.style.top= '0px';
labelRenderer.domElement.style.pointerEvents= 'none';
document.body.appendChild(labelRenderer.domElement);



//GAMELOOP






//car
let car;
let mixer;
const loader = new GLTFLoader();
loader.load('alfa_6c_concept_by_max_hordin.glb',
  function(gltf){
    car=gltf.scene;
    car.position.setX(0);
    car.position.setZ(0);
   
    scene.add(car);
    mixer= new THREE.AnimationMixer(car);
    mixer.clipAction(gltf.animations[0]).play();
  },
  function (xhr){},
  function (error) {}
)


// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff,3);
scene.add(pointLight, ambientLight);

const gridHelper =new THREE.GridHelper(50,50);
scene.add(gridHelper);
const controls =new OrbitControls(camera,renderer.domElement);
const topLight=new THREE.DirectionalLight(0xffffff,3);
scene.add(topLight);



//stars
function addStar()
{
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color : 0xffffff})
  const star = new THREE.Mesh(geometry,material);

  //to generate random coordinates
  const [x,y,z]=Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x,y,z);
  scene.add(star);

}

Array(400).fill().forEach(addStar);

//RESIZZE HANDLER
function onWindowResize()
{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
  labelRenderer.setSize(this.window.innerWidth,this.window.innerHeight);
}
window.addEventListener('resize',onWindowResize);

var listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
var sound = new THREE.Audio( listener );

var audioLoader = new THREE.AudioLoader();




//smoke
const smokeTexture= new THREE.TextureLoader().load('/black-flame-border-realistic-fire-ai-generated-photo.png');
smokeTexture.encoding = THREE.sRGBEncoding;
const smokeGeometry = new THREE.TorusKnotGeometry(3,3,3);

const smokeMaterial= new THREE.MeshLambertMaterial({
  map: smokeTexture,
  emissive: 0x222222,
  opacity: 0.005,
  transparent:true
})

let smokeParticles =[];

for (let i=0;i<100;i++){
  let smokeElement = new THREE.Mesh(smokeGeometry,smokeMaterial);
  smokeElement.scale.set(2,2,2);

  smokeElement.position.set(0,0,0);
  

  scene.add(smokeElement);
  smokeParticles.push(smokeElement);
}

//textures 
const geo1= new THREE.TorusKnotGeometry(10);
const mat1= new THREE.MeshLambertMaterial({
  map: smokeTexture,
  emissive: 0x222222,
  opacity: 0.1,
  transparent:true

})
const texture1 = new THREE.Mesh(geo1,mat1);
texture1.position.set(0,0,0);
scene.add(texture1);



function createCpointMesh(name,x,y,z){
  const geo= new THREE.SphereGeometry(0.05)
  const mat= new THREE.MeshBasicMaterial({color: 0xff0000});
  const mesh = new THREE.Mesh(geo,mat);
  mesh.position.set(x,y,z);
  mesh.name=name;
  return mesh;
}
const group = new THREE.Group();
const sphereMesh1 = createCpointMesh('sphereMesh1',0,1,-3);
group.add(sphereMesh1);


const sphereMesh2 = createCpointMesh('sphereMesh2',1,1,-0.5);
group.add(sphereMesh2);

const sphereMesh3 = createCpointMesh('sphereMesh3',2.1,0.8,-2.7);
group.add(sphereMesh3);

const sphereMesh4 = createCpointMesh('sphereMesh4',0,1,1);
group.add(sphereMesh4);

const sphereMesh5 = createCpointMesh('sphereMesh5',1,0,0.2);
group.add(sphereMesh5);




scene.add(group);


const p = document.createElement('p');
p.className='tooltip';
const h1 =document.createElement('h1');
h1.className='tooltip1';
const img = document.createElement('img');
img.className='tooltip2';

const pContainer =document.createElement('div');
pContainer.appendChild(h1);
pContainer.appendChild(p);
pContainer.appendChild(img);




const cPointLabel= new CSS2DObject(pContainer);
scene.add(cPointLabel);
const mousePos= new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove',function(e){
  mousePos.x= (e.clientX /this.window.innerWidth)*2-1;
  mousePos.y= -(e.clientY /this.window.innerHeight)*2+1;

  raycaster.setFromCamera(mousePos,camera);
  const intersects = raycaster.intersectObject(group);
  if (intersects.length>0)
  {
    switch(intersects[0].object.name)
    {
      case 'sphereMesh1':
        {
        p.className='tooltip show';
        h1.className='tooltip1 show';
        img.className='tooltip2 show';
        
        cPointLabel.position.set(0,1,-3);
        h1.textContent="PERFORMANCE";
        p.textContent = 'For pure adrenaline, nothing beats the Alfa Romeo Giulia Quadrifoglio and Stelvio Quadrifoglio. A century of racing prowess stands behind these masters of the track, as their maximum top speeds and 0-60 mph acceleration times clearly demonstrate. With a near-perfect 50/50 weight distribution and anti-slip regulation torque control to control the distribution of torque between the rear wheels, Quadrifoglio models will let you push your Alfa Romeo vehicle to the limit.';
        img.src='/engine.png';

//Load a sound and set it as the Audio object's buffer
        audioLoader.load('/performance.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
          });
        break;
        }

      case 'sphereMesh2':
        {
        p.className='tooltip show';
        h1.className='tooltip1 show';
        img.className='tooltip2 show';
        cPointLabel.position.set(1,1,-0.5);
        h1.textContent="EXTERIOR STYLE";
        p.textContent = 'Sleek lines, striking exterior colors and a commanding presence catch everyones eye. Like the muscular performance of the Giulia, an Alfa Romeo vehicle makes everyone stop and stare.You can also select your vehicles look with your choice of distinctive available trims which include badging and color adjustments to make your vehicle stand out. In addition, you can select from available wheels, available accent colored brake calipers and available exterior features like a sunroof or roof side rails to make your Alfa Romeo Stelvio, Guilia or Tonale your own.';
        img.src='/style.png';
        //Load a sound and set it as the Audio object's buffer
        audioLoader.load('/exterior.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
          });
        break;
        }

      case 'sphereMesh3':
        {
        p.className='tooltip show';
        h1.className='tooltip1 show';
        img.className='tooltip2 show';
        cPointLabel.position.set(2.1,0.8,-2.7);
        h1.textContent="INTERIOR COMFORT";
        p.textContent = ' Your Alfa Romeo vehicle has it all: luxurious leather-trimmed seating in your choice of available colors, a customizable 8.8-inch multitouch display at your fingertips and the convenience of a race-inspired cockpit. The sleek design even extends to the wireless charging pad, so you can charge your devices on the go without any unsightly wires to keep track of.';
        img.src='/interior.png';
        //Load a sound and set it as the Audio object's buffer
        audioLoader.load('/attention.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
          });
        break;
        }

        case 'sphereMesh4':
        {
        p.className='tooltip show';
        h1.className='tooltip1 show';
        img.className='tooltip2 show';
        cPointLabel.position.set(0,1,1);
        h1.textContent="SAFETY AND SECURITY";
        p.textContent = 'Standard and available safety and security features abound in Alfa Romeo luxury vehicles. With the available Active Assist Plus Package, your Alfa Romeo Giulia, Stelvio or Tonale can alert you to potential issues by using visual and audible notifications and can even intervene when necessary to help keep you out of harm’s way. This package, which is available on Ti, Veloce, Competitizione and Quadrifoglio models, includes Active Blind Spot Assist*, Driver Attention Alert*, the Highway Assist System*, Intelligent Speed Assist*, Lane Keep Assist, Traffic Jam Assist* and Traffic Sign Recognition*';
        img.src='/safety.png';
        //Load a sound and set it as the Audio object's buffer
        audioLoader.load('/safety.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
          });
        break;
        }

        case 'sphereMesh5':
        {
        p.className='tooltip show';
        h1.className='tooltip1 show';
        img.className='tooltip2 show';
        cPointLabel.position.set(2.1,0.8,-2.7);
        h1.textContent="WHEELS";
        p.textContent = ' 18-Inch x 8.0-Inch Dark Turbine Aluminum Wheels';
        img.src='hey.png';
        //Load a sound and set it as the Audio object's buffer
        audioLoader.load('/tyre.mp3', function( buffer ) {
          sound.setBuffer( buffer );
          sound.setLoop(true);
          sound.setVolume(0.5);
          sound.play();
          });
        break;
        }
    }
  }
  else{
    p.className='hello hey';
    p.textContent="hover over red dots to see magic";
    h1.className='tooltip1 hide';
    img.className='tooltip2 hide';
    sound.stop();
    
  }
})
// Helpers

audioLoader.load('/night-racing-273970.mp3', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});
function animate(){

  
     
  requestAnimationFrame(animate);
  delta=clock.getDelta();

  for (let i=0;i<smokeParticles.length;i++)
  {
    smokeParticles[i].rotation.z+=(delta*0.1);
    smokeParticles[i].rotation.y+=(delta*0.12);
    smokeParticles[i].rotation.x+=(delta*0.2);
  }
  mixer.update(0.02); 
  controls.update();
  labelRenderer.render(scene,camera)
  renderer.render(scene, camera);
};
animate();