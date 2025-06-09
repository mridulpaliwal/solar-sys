// main.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xFDB813 })
);
scene.add(sun);

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(0, 0, 0);
scene.add(light);

camera.position.set(0, 15, 30);
controls.update();

const planetData = [
  { name: 'Mercury', color: 0xaaaaaa, size: 0.3, distance: 4, speed: 0.02 },
  { name: 'Venus', color: 0xffcc99, size: 0.6, distance: 6, speed: 0.015 },
  { name: 'Earth', color: 0x3399ff, size: 0.65, distance: 8, speed: 0.01 },
  { name: 'Mars', color: 0xff3300, size: 0.5, distance: 10, speed: 0.008 },
  { name: 'Jupiter', color: 0xff9966, size: 1.2, distance: 13, speed: 0.005 },
  { name: 'Saturn', color: 0xffff99, size: 1.1, distance: 16, speed: 0.004 },
  { name: 'Uranus', color: 0x99ffff, size: 0.9, distance: 19, speed: 0.003 },
  { name: 'Neptune', color: 0x6666ff, size: 0.85, distance: 22, speed: 0.002 },
];

const planets = [];

planetData.forEach((data, index) => {
  const geometry = new THREE.SphereGeometry(data.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  planets.push({ mesh, ...data, angle: 0 });

  // Speed Control UI
  const label = document.createElement('label');
  label.textContent = `${data.name} Speed:`;
  label.className = 'slider-label';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = 0.05;
  slider.step = 0.001;
  slider.value = data.speed;
  slider.className = 'slider';
  slider.oninput = (e) => {
    planets[index].speed = parseFloat(e.target.value);
  };

  const controlPanel = document.getElementById('speedControls');
  controlPanel.appendChild(label);
  controlPanel.appendChild(slider);
});

let isPaused = false;
document.getElementById('toggleAnimation').onclick = () => {
  isPaused = !isPaused;
  document.getElementById('toggleAnimation').textContent = isPaused ? 'Resume' : 'Pause';
};

function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    planets.forEach((planet) => {
      planet.angle += planet.speed;
      const x = Math.cos(planet.angle) * planet.distance;
      const z = Math.sin(planet.angle) * planet.distance;
      planet.mesh.position.set(x, 0, z);
    });
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
