const canvas = document.getElementById('avatarCanvas');

// Set up basic Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3); // better default view
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Optional: Add light so model is visible
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Load GLB model
const loader = new THREE.GLTFLoader();
loader.load(
  'avatar.glb',
  (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -1, 0); // lower to ground
    scene.add(model);
    console.log("✅ Model loaded");
  },
  (xhr) => {
    console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error("❌ Error loading model:", error);
  }
);

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Speech logic
document.getElementById('talk').addEventListener('click', () => {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript;
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText }),
    });
    const data = await res.json();
    speak(data.reply);
  };
});

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}
