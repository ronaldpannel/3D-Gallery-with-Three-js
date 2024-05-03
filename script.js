import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const startScreen = document.getElementById("container");
const enterBtn = document.getElementById("enterBtn");


let renderer, camera, scene, pointerControl, orbitControls;


scene = new THREE.Scene({ antialize: true });

const loader = new GLTFLoader();

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
orbitControls = new OrbitControls(camera, renderer.domElement);
pointerControl = new PointerLockControls(camera, document.body);

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: "green" });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.set(0,-5,0)
scene.add(cube);

//create floor
const texture = new THREE.TextureLoader().load("WoodFloor.png");
const floorMAt = new THREE.MeshStandardMaterial({ map: texture });
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floor = new THREE.Mesh(floorGeo, floorMAt);
floor.castShadow = false;
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = -Math.PI * 3;
scene.add(floor);

//create walls
const BackWallTexture = new THREE.TextureLoader().load("WallText.webp");
const backWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const backWallMat = new THREE.MeshStandardMaterial({ map: BackWallTexture });
const backWall = new THREE.Mesh(backWallGeo, backWallMat);
backWall.castShadow = true;
backWall.receiveShadow = true;
backWall.position.z = -20;

//create left wall
const LeftWallTexture = new THREE.TextureLoader().load("WallText.webp");
const leftWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const leftWallMat = new THREE.MeshStandardMaterial({ map: LeftWallTexture });
const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
leftWall.castShadow = true;
leftWall.receiveShadow = true;
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//create right Wall
const rightWallTexture = new THREE.TextureLoader().load("WallText.webp");
const rightWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const rightWallMat = new THREE.MeshStandardMaterial({ map: rightWallTexture });
const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
rightWall.castShadow = true;
rightWall.receiveShadow = true;
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

// create celling
const cellingTexture = new THREE.TextureLoader().load("OfficeCeiling.png");
const cellingMAt = new THREE.MeshStandardMaterial({ map: cellingTexture });
const cellingGeo = new THREE.PlaneGeometry(50, 50);
const celling = new THREE.Mesh(cellingGeo, cellingMAt);
celling.castShadow = true;
celling.receiveShadow = true;
celling.rotation.x = Math.PI / 2;
celling.position.y = 10;
scene.add(celling);

const wallGroup = new THREE.Group();
wallGroup.add(backWall);
wallGroup.add(leftWall);
wallGroup.add(rightWall);

//create collision bounding box for each wall
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BoundingBox = new THREE.Box3();
  wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}
function checkCollision() {
  const playerBoundingBox = new THREE.Box3();
  const cameraWorldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraWorldPosition);
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );

  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }
  return false;
}
scene.add(wallGroup);

//create lights
const ambLight = new THREE.AmbientLight(0xffffff, .5);
scene.add(ambLight);

const spotLight = new THREE.SpotLight(0xfffffff, 1000, -13,Math.PI/3, 0.7);
spotLight.position.set(3,  -1, 4)
spotLight.rotation.x = 0
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001
scene.add(spotLight);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

const spotLight1 = new THREE.SpotLight(0xfffffff, 1000, -13, Math.PI / 3, 0.7);
spotLight1.position.set(-4, -1, 4);
spotLight1.rotation.x = 0;
spotLight1.castShadow = true;
spotLight1.shadow.bias = -0.0001;
scene.add(spotLight1);

// const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
// scene.add(spotLightHelper1);

//create Paintings
function createPainting(imageUrl, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageUrl);
  const paintingMat = new THREE.MeshBasicMaterial({ map: paintingTexture });
  const paintingGeo = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeo, paintingMat);
  painting.position.set(position.x, position.y, position.z);
  return painting;
}
const photo1 = createPainting(
  "chase.jpeg",
  5,
  10,
  new THREE.Vector3(-15, 0, -19)
);

scene.add(photo1);
const photo2 = createPainting(
  "rose.jpeg",
  5,
  10,
  new THREE.Vector3(-8, 0, -19.99)
);
scene.add(photo2);

const photo3 = createPainting(
  "ralph.jpeg",
  5,
  10,
  new THREE.Vector3(0, 0, -19.99)
);
scene.add(photo3);

const photo4 = createPainting(
  "erin.jpeg",
  5,
  10,
  new THREE.Vector3(7.5, 0, -19.99)
);
scene.add(photo4);
const photo5 = createPainting(
  "nora.jpeg",
  5,
  10,
  new THREE.Vector3(15.5, 0, -19.99)
);
scene.add(photo5);

const photo6 = createPainting(
  "neve.jpeg",
  5,
  9,
  new THREE.Vector3(19.99, 0, -12.99)
);
photo6.rotation.y = -Math.PI / 2;
scene.add(photo6);

const photo7 = createPainting(
  "nora and neve.jpeg",
  5,
  8,
  new THREE.Vector3(19.99, 0, -5.5)
);
photo7.rotation.y = -Math.PI / 2;
scene.add(photo7);

const photo8 = createPainting(
  "Vicky.jpeg",
  5,
  10,
  new THREE.Vector3(-19.99, 0, -12.99)
);

photo8.rotation.y = Math.PI / 2;
scene.add(photo8);

const photo9 = createPainting(
  "nicola.jpeg",
  5,
  10,
  new THREE.Vector3(-19.99, 0, -5.5)
);
photo9.rotation.y = Math.PI / 2;
scene.add(photo9);

//start and stop gallery entry

enterBtn.addEventListener("click", () => {
  startExperience();
});

function startExperience() {
  pointerControl.lock();
  hideMenu();
}

function hideMenu() {
  startScreen.style.display = "none";
}
function showMenu() {
  startScreen.style.display = "block";
}

//key control
const keyPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  r: false,
};

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key in keyPressed) {
      keyPressed[e.key] = true;
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (e) => {
    if (e.key in keyPressed) {
      keyPressed[e.key] = false;
    }
  },
  false
);

const clock = new THREE.Clock();

function updateMovement(delta) {
  const moveSpeed = 5 * delta;
  const previousPosition = camera.position.clone();

  if (keyPressed.ArrowRight || keyPressed.d) {
    pointerControl.moveRight(moveSpeed);
  }
  if (keyPressed.ArrowLeft || keyPressed.a) {
    pointerControl.moveRight(-moveSpeed);
  }
  if (keyPressed.ArrowUp || keyPressed.w) {
    pointerControl.moveForward(moveSpeed);
  }
  if (keyPressed.ArrowDown || keyPressed.s) {
    pointerControl.moveForward(-moveSpeed);
  }
  if (keyPressed.r) {
    showMenu();
    pointerControl.unlock();
  }
  if (checkCollision()) {
    camera.position.copy(previousPosition);
  }
}

let render = function () {
  const delta = clock.getDelta();
  updateMovement(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
