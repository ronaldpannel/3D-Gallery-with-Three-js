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
const cubeMat = new THREE.MeshBasicMaterial({ color: "green" });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
scene.add(cube);

function animate() {
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.005;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
