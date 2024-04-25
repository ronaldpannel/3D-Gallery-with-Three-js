const startScreen = document.getElementById("container");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  startScreen.classList.add("menuInactive");
});
let renderer, camera, scene;

scene = new THREE.Scene({antialize: true});

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: "green" });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

//floor
const texture = new THREE.TextureLoader().load("WoodFloor.png");
const floorMAt = new THREE.MeshBasicMaterial({map: texture})
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floor = new THREE.Mesh(floorGeo, floorMAt);
floor.rotation.x = Math.PI /4
floor.position.y = Math.PI

scene.add(floor);

const hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);




function animate() {
  cube.rotation.y += 0.005;
  cube.rotation.x += 0.005;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
//key controls
document.addEventListener('keydown', onKeydown, false)

function onKeydown(e){
console.log(e.key)
if (e.key === "ArrowLeft" || e.key.toLowerCase() === 'a') {
  camera.translateX(0.1);
} else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
  camera.translateX(-0.1);
} else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
  camera.translateY(-0.1);
} else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
  camera.translateY(0.1);
}
}




window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
