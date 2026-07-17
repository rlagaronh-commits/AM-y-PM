const progressBar = document.getElementById('progressBar');
const openStory = document.getElementById('openStory');
const heartButton = document.getElementById('heartButton');
const secretMessage = document.getElementById('secretMessage');
const soundToggle = document.getElementById('soundToggle');

// Estrellas generadas sin imágenes externas.
const stars = document.getElementById('stars');
for (let i = 0; i < 70; i += 1) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 4}s`;
  star.style.animationDuration = `${3 + Math.random() * 4}s`;
  stars.appendChild(star);
}

// Barra de progreso de lectura.
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
}, { passive: true });

// Aparición suave de cada escena.
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal:not(.visible)').forEach((element) => observer.observe(element));

openStory.addEventListener('click', () => {
  document.getElementById('capitulo').scrollIntoView({ behavior: 'smooth' });
});

// Corazones y mensaje final.
heartButton.addEventListener('click', () => {
  secretMessage.classList.add('show');
  heartButton.textContent = '♥';

  const rect = heartButton.getBoundingClientRect();
  for (let i = 0; i < 14; i += 1) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.45 ? '♡' : '✦';
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.top = `${rect.top + window.scrollY + rect.height / 2}px`;
    heart.style.setProperty('--x', `${(Math.random() - 0.5) * 210}px`);
    heart.style.setProperty('--r', `${(Math.random() - 0.5) * 100}deg`);
    heart.style.animationDelay = `${Math.random() * 0.25}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2300);
  }
});

// Música romántica original generada por Web Audio.
// No utiliza archivos externos ni canciones con copyright.
let audioContext;
let masterGain;
let musicTimer;
let isPlaying = false;
let step = 0;

const romanticPieces = [
  {
    title: 'Entre pantallas',
    tempo: 72,
    progression: [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 440.00],
      [174.61, 220.00, 261.63, 349.23],
      [196.00, 246.94, 293.66, 392.00]
    ]
  },
  {
    title: 'Dos países',
    tempo: 68,
    progression: [
      [293.66, 369.99, 440.00, 554.37],
      [246.94, 293.66, 369.99, 493.88],
      [196.00, 246.94, 293.66, 392.00],
      [220.00, 277.18, 329.63, 440.00]
    ]
  },
  {
    title: 'AM y PM',
    tempo: 76,
    progression: [
      [261.63, 329.63, 392.00, 523.25],
      [196.00, 261.63, 329.63, 392.00],
      [220.00, 261.63, 329.63, 440.00],
      [174.61, 220.00, 261.63, 349.23]
    ]
  }
];

let pieceIndex = 0;

function createSoftNote(frequency, startTime, duration, volume = 0.07) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, startTime);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, startTime);
  filter.Q.value = 0.4;

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(filter).connect(gain).connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.08);
}

function playMusicStep() {
  if (!isPlaying || !audioContext) return;

  const piece = romanticPieces[pieceIndex];
  const beat = 60 / piece.tempo;
  const chordIndex = Math.floor(step / 8) % piece.progression.length;
  const noteIndex = step % 8;
  const chord = piece.progression[chordIndex];
  const now = audioContext.currentTime + 0.03;

  // Arpegio principal muy suave, pensado para no distraer de la lectura.
  const melodyPattern = [0, 2, 1, 3, 2, 1, 0, 2];
  createSoftNote(chord[melodyPattern[noteIndex]], now, beat * 1.65, 0.052);

  // Bajo cálido cada cuatro pulsos.
  if (noteIndex % 4 === 0) {
    createSoftNote(chord[0] / 2, now, beat * 3.6, 0.036);
  }

  step += 1;

  // Cambia de pieza aproximadamente cada minuto y medio.
  if (step >= 112) {
    step = 0;
    pieceIndex = (pieceIndex + 1) % romanticPieces.length;
    soundToggle.title = `Sonando: ${romanticPieces[pieceIndex].title}`;
  }

  musicTimer = window.setTimeout(playMusicStep, beat * 1000);
}

async function startAmbientSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    soundToggle.title = 'Tu navegador no admite audio ambiental';
    return;
  }

  audioContext = audioContext || new AudioContext();
  if (audioContext.state === 'suspended') await audioContext.resume();

  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.72, audioContext.currentTime + 1.2);
  masterGain.connect(audioContext.destination);

  isPlaying = true;
  step = 0;
  soundToggle.classList.add('active');
  soundToggle.querySelector('.sound-icon').textContent = '❚❚';
  soundToggle.querySelector('.sound-label').textContent = 'pausar';
  soundToggle.setAttribute('aria-label', 'Pausar música romántica suave');
  soundToggle.title = `Sonando: ${romanticPieces[pieceIndex].title}`;
  playMusicStep();
}

function stopAmbientSound() {
  if (!audioContext || !masterGain) return;

  isPlaying = false;
  window.clearTimeout(musicTimer);
  masterGain.gain.cancelScheduledValues(audioContext.currentTime);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.65);

  window.setTimeout(() => {
    try { masterGain.disconnect(); } catch (_) { /* Ya desconectado */ }
  }, 750);

  soundToggle.classList.remove('active');
  soundToggle.querySelector('.sound-icon').textContent = '♫';
  soundToggle.querySelector('.sound-label').textContent = 'música suave';
  soundToggle.setAttribute('aria-label', 'Reproducir música romántica suave');
  soundToggle.title = 'Música romántica suave';
}

soundToggle.addEventListener('click', () => {
  if (isPlaying) stopAmbientSound();
  else startAmbientSound();
});
