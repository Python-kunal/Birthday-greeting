import * as THREE from "three";

const canvas = document.querySelector("#birthday-scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 1.2, 12);

const ambient = new THREE.AmbientLight(0xffffff, 1.2);
const keyLight = new THREE.PointLight(0xffd166, 2.4, 40);
keyLight.position.set(-4, 5, 6);
const rimLight = new THREE.PointLight(0x67e8f9, 2.8, 44);
rimLight.position.set(5, 3, 4);
scene.add(ambient, keyLight, rimLight);

const heroGroup = new THREE.Group();
scene.add(heroGroup);

const balloonColors = [0xff5c8a, 0xffd166, 0x67e8f9, 0x92f2b3, 0xb794f4];
const balloonGroup = new THREE.Group();
heroGroup.add(balloonGroup);

function makeBalloon(index) {
  const material = new THREE.MeshPhysicalMaterial({
    color: balloonColors[index % balloonColors.length],
    roughness: 0.25,
    metalness: 0.03,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
  });
  const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.48, 42, 42), material);
  balloon.scale.set(0.88, 1.18, 0.88);

  const knot = new THREE.Mesh(
    new THREE.ConeGeometry(0.13, 0.2, 18),
    new THREE.MeshStandardMaterial({ color: balloonColors[index % balloonColors.length] })
  );
  knot.position.y = -0.64;
  knot.rotation.x = Math.PI;

  const string = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -0.72, 0),
      new THREE.Vector3(0.05, -1.2, 0),
      new THREE.Vector3(-0.04, -1.74, 0),
    ]),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
  );

  const group = new THREE.Group();
  group.add(balloon, knot, string);
  group.position.set((index - 3) * 1.15, Math.sin(index) * 0.4 + 1.65, -index * 0.2);
  group.userData.floatSeed = index * 0.7;
  return group;
}

Array.from({ length: 7 }, (_, index) => makeBalloon(index)).forEach((balloon) => balloonGroup.add(balloon));

const cakeGroup = new THREE.Group();
heroGroup.add(cakeGroup);
cakeGroup.position.set(3.45, -1.68, -0.25);
cakeGroup.rotation.y = -0.45;

const cakeMaterial = new THREE.MeshStandardMaterial({ color: 0xffe5ec, roughness: 0.42 });
const icingMaterial = new THREE.MeshStandardMaterial({ color: 0xff5c8a, roughness: 0.35 });
const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xffd166, roughness: 0.3, metalness: 0.18 });
const ribbonMaterial = new THREE.MeshStandardMaterial({ color: 0x67e8f9, roughness: 0.22, metalness: 0.12 });

const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.48, 0.7, 64), cakeMaterial);
const mid = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.16, 0.58, 64), icingMaterial);
mid.position.y = 0.58;
const top = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.78, 0.42, 64), cakeMaterial);
top.position.y = 1.08;
cakeGroup.add(base, mid, top);

for (let i = 0; i < 8; i += 1) {
  const angle = (i / 8) * Math.PI * 2;
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 18, 18), goldMaterial);
  dot.position.set(Math.cos(angle) * 1.06, 0.96, Math.sin(angle) * 1.06);
  cakeGroup.add(dot);
}

for (let i = 0; i < 5; i += 1) {
  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.56, 18),
    new THREE.MeshStandardMaterial({ color: i % 2 ? 0x67e8f9 : 0xffd166 })
  );
  candle.position.set((i - 2) * 0.24, 1.55, Math.abs(i - 2) * 0.08);
  const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 18, 18),
    new THREE.MeshBasicMaterial({ color: 0xfff2a6 })
  );
  flame.scale.set(0.7, 1.35, 0.7);
  flame.position.y = 0.36;
  candle.add(flame);
  cakeGroup.add(candle);
}

const giftGroup = new THREE.Group();
heroGroup.add(giftGroup);
giftGroup.position.set(-3.8, -1.95, -0.65);
giftGroup.rotation.y = 0.45;

const giftBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 0.95, 1.25),
  new THREE.MeshPhysicalMaterial({
    color: 0x7c3aed,
    roughness: 0.34,
    metalness: 0.05,
    clearcoat: 0.6,
  })
);
const giftLid = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.24, 1.42), goldMaterial);
giftLid.position.y = 0.58;
const ribbonVertical = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.26, 1.48), ribbonMaterial);
ribbonVertical.position.y = 0.12;
const ribbonHorizontal = new THREE.Mesh(new THREE.BoxGeometry(1.48, 1.26, 0.18), ribbonMaterial);
ribbonHorizontal.position.y = 0.12;

const bowLeft = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.055, 16, 36), ribbonMaterial);
bowLeft.position.set(-0.24, 0.83, 0);
bowLeft.scale.set(1.25, 0.78, 0.7);
bowLeft.rotation.y = Math.PI / 2;
const bowRight = bowLeft.clone();
bowRight.position.x = 0.24;
bowRight.rotation.y = Math.PI / 2;

giftGroup.add(giftBox, giftLid, ribbonVertical, ribbonHorizontal, bowLeft, bowRight);

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 650;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const color = new THREE.Color();

for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 22;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  color.setHex(balloonColors[i % balloonColors.length]);
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.95 })
);
scene.add(particles);

const ringGeometry = new THREE.TorusGeometry(3.15, 0.012, 12, 120);
const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.26 });
const celebrationRing = new THREE.Mesh(ringGeometry, ringMaterial);
celebrationRing.position.set(0, -0.1, -1.35);
celebrationRing.rotation.x = Math.PI / 2.7;
heroGroup.add(celebrationRing);

const pointer = { x: 0, y: 0 };
window.addEventListener("pointermove", (event) => {
  pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
  pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
});

function resizeScene() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (window.innerWidth < 760) {
    heroGroup.position.set(0, -0.1, -1.7);
    heroGroup.scale.setScalar(0.78);
  } else {
    heroGroup.position.set(0.4, 0, -0.55);
    heroGroup.scale.setScalar(1);
  }
}

window.addEventListener("resize", resizeScene);
resizeScene();

function animateScene(time) {
  const t = time * 0.001;
  heroGroup.rotation.y = pointer.x * 0.12;
  heroGroup.rotation.x = -pointer.y * 0.05;
  balloonGroup.children.forEach((balloon, index) => {
    balloon.position.y += Math.sin(t * 1.4 + balloon.userData.floatSeed) * 0.0025;
    balloon.rotation.z = Math.sin(t + index) * 0.08;
  });
  cakeGroup.rotation.y = -0.45 + Math.sin(t * 0.7) * 0.08;
  giftGroup.rotation.y = 0.45 + Math.sin(t * 0.85) * 0.18;
  giftGroup.position.y = -1.95 + Math.sin(t * 1.2) * 0.08;
  giftLid.position.y = 0.58 + Math.max(0, Math.sin(t * 1.6)) * 0.05;
  celebrationRing.rotation.z = t * 0.18;
  celebrationRing.material.opacity = 0.2 + Math.sin(t * 1.4) * 0.06;
  particles.rotation.y = t * 0.035;
  particles.rotation.x = Math.sin(t * 0.2) * 0.04;
  renderer.render(scene, camera);
  requestAnimationFrame(animateScene);
}

requestAnimationFrame(animateScene);

document.querySelectorAll(".photo-card img").forEach((image) => {
  image.addEventListener("error", () => {
    image.remove();
  });
});

const heroPortrait = document.querySelector(".portrait-frame img");
if (heroPortrait) {
  heroPortrait.addEventListener("error", () => {
    heroPortrait.classList.add("is-hidden");
  });
}

const portraitStage = document.querySelector(".hero-portrait");
if (portraitStage) {
  portraitStage.addEventListener("pointermove", (event) => {
    const bounds = portraitStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitStage.style.setProperty("--tilt-x", `${x * 7}deg`);
    portraitStage.style.setProperty("--tilt-y", `${y * -7}deg`);
  });

  portraitStage.addEventListener("pointerleave", () => {
    portraitStage.style.setProperty("--tilt-x", "0deg");
    portraitStage.style.setProperty("--tilt-y", "0deg");
  });
}

const audio = document.querySelector("#ambient-audio");
const soundToggle = document.querySelector("#sound-toggle");
let userMutedAudio = false;

async function startAudio() {
  if (!audio || userMutedAudio) return;
  try {
    audio.volume = 0.72;
    await audio.play();
    soundToggle.classList.add("is-on");
  } catch {
    soundToggle.classList.remove("is-on");
  }
}

window.addEventListener("DOMContentLoaded", startAudio);
window.addEventListener("load", startAudio);
window.addEventListener("pageshow", startAudio);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) startAudio();
});
["pointerdown", "pointermove", "mousemove", "keydown", "touchstart", "scroll", "focus"].forEach((eventName) => {
  window.addEventListener(eventName, startAudio, { once: true, passive: true });
});

soundToggle.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      userMutedAudio = false;
      await audio.play();
      soundToggle.classList.add("is-on");
    } else {
      userMutedAudio = true;
      audio.pause();
      soundToggle.classList.remove("is-on");
    }
  } catch {
    soundToggle.classList.remove("is-on");
  }
});

const confettiCanvas = document.querySelector("#confetti-canvas");
const confettiContext = confettiCanvas.getContext("2d");
let confettiPieces = [];

function resizeConfetti() {
  confettiCanvas.width = confettiCanvas.offsetWidth * window.devicePixelRatio;
  confettiCanvas.height = confettiCanvas.offsetHeight * window.devicePixelRatio;
  confettiContext.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function launchConfetti() {
  const width = confettiCanvas.offsetWidth;
  const types = ["confetti", "gift", "gift", "heart", "star", "cartoon"];
  confettiPieces = Array.from({ length: 260 }, (_, index) => ({
    x: Math.random() * width,
    y: -40 - Math.random() * 520,
    size: 7 + Math.random() * (index % 5 === 0 ? 22 : 12),
    speed: 2.2 + Math.random() * 5.8,
    drift: -1.8 + Math.random() * 3.6,
    spin: Math.random() * Math.PI,
    spinSpeed: -0.08 + Math.random() * 0.16,
    color: `hsl(${Math.floor(Math.random() * 360)}, 88%, 68%)`,
    type: types[Math.floor(Math.random() * types.length)],
  }));
}

function drawGift(context, size) {
  const box = size * 0.84;
  context.fillStyle = "#ff5c8a";
  context.fillRect(-box / 2, -box * 0.2, box, box * 0.62);
  context.fillStyle = "#7c3aed";
  context.fillRect(-box / 2, -box * 0.2, box * 0.45, box * 0.62);
  context.fillStyle = "#ffd166";
  context.fillRect(-box * 0.58, -box * 0.36, box * 1.16, box * 0.2);
  context.fillStyle = "#67e8f9";
  context.fillRect(-box * 0.08, -box * 0.38, box * 0.16, box * 0.8);
  context.strokeStyle = "#67e8f9";
  context.lineWidth = Math.max(2, size * 0.08);
  context.beginPath();
  context.arc(-box * 0.16, -box * 0.44, box * 0.14, 0, Math.PI * 2);
  context.arc(box * 0.16, -box * 0.44, box * 0.14, 0, Math.PI * 2);
  context.stroke();
}

function drawHeart(context, size) {
  context.fillStyle = "#ff5c8a";
  context.beginPath();
  context.moveTo(0, size * 0.38);
  context.bezierCurveTo(-size, -size * 0.2, -size * 0.42, -size * 0.72, 0, -size * 0.28);
  context.bezierCurveTo(size * 0.42, -size * 0.72, size, -size * 0.2, 0, size * 0.38);
  context.fill();
}

function drawStar(context, size) {
  context.fillStyle = "#ffd166";
  context.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 ? size * 0.35 : size * 0.72;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fill();
}

function drawCuteBuddy(context, size) {
  const radius = size * 0.52;
  context.fillStyle = "#67e8f9";
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#fffaf2";
  context.beginPath();
  context.arc(0, radius * 0.18, radius * 0.62, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#101014";
  context.beginPath();
  context.arc(-radius * 0.22, -radius * 0.12, radius * 0.08, 0, Math.PI * 2);
  context.arc(radius * 0.22, -radius * 0.12, radius * 0.08, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#101014";
  context.lineWidth = Math.max(1.4, size * 0.04);
  context.beginPath();
  context.arc(0, radius * 0.14, radius * 0.28, 0.15, Math.PI - 0.15);
  context.stroke();
  context.fillStyle = "#ff5c8a";
  context.beginPath();
  context.arc(0, radius * 0.05, radius * 0.07, 0, Math.PI * 2);
  context.fill();
}

function drawConfetti() {
  const width = confettiCanvas.offsetWidth;
  const height = confettiCanvas.offsetHeight;
  confettiContext.clearRect(0, 0, width, height);
  confettiPieces.forEach((piece) => {
    piece.y += piece.speed;
    piece.x += piece.drift + Math.sin(piece.y * 0.03) * 1.5;
    piece.spin += piece.spinSpeed;
    if (piece.y > height + 30) {
      piece.y = -40 - Math.random() * 160;
      piece.x = Math.random() * width;
    }
    confettiContext.save();
    confettiContext.translate(piece.x, piece.y);
    confettiContext.rotate(piece.spin);
    if (piece.type === "gift") {
      drawGift(confettiContext, piece.size);
    } else if (piece.type === "heart") {
      drawHeart(confettiContext, piece.size);
    } else if (piece.type === "star") {
      drawStar(confettiContext, piece.size);
    } else if (piece.type === "cartoon") {
      drawCuteBuddy(confettiContext, piece.size * 1.35);
    } else {
      confettiContext.fillStyle = piece.color;
      confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
    }
    confettiContext.restore();
  });
  requestAnimationFrame(drawConfetti);
}

window.addEventListener("resize", resizeConfetti);
resizeConfetti();
drawConfetti();

const revealButton = document.querySelector("#reveal-button");
const surpriseInner = document.querySelector(".surprise-inner");
const surpriseTitle = document.querySelector("#surprise-title");
const birthdayBuddy = document.querySelector("#birthday-buddy");
revealButton.addEventListener("click", () => {
  surpriseInner.classList.add("is-revealed");
  birthdayBuddy?.classList.add("is-visible");
  surpriseTitle.textContent = "Happy Birthday, Tusharika";
  revealButton.textContent = "Wish Revealed";
  launchConfetti();
  startAudio();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".photo-card, .party-machine, .orbit-tag").forEach((element) => {
  element.classList.add("reveal-up");
  observer.observe(element);
});
