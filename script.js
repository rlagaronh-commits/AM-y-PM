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

// Ambiente musical generado por Web Audio: no necesita archivos ni música con copyright.
let audioContext;
let masterGain;
let activeOscillators = [];
let isPlaying = false;

function startAmbientSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioContext = audioContext || new AudioContext();
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 1.5);
  masterGain.connect(audioContext.destination);

  const notes = [130.81, 196.0, 261.63, 329.63];
  activeOscillators = notes.map((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index * 3;
    gain.gain.value = 0.12 / notes.length;
    oscillator.connect(gain).connect(masterGain);
    oscillator.start();
    return oscillator;
  });

  isPlaying = true;
  soundToggle.classList.add('active');
  soundToggle.setAttribute('aria-label', 'Desactivar sonido ambiental');
}

function stopAmbientSound() {
  if (!audioContext || !masterGain) return;
  masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.6);
  setTimeout(() => {
    activeOscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch (_) { /* Ya detenido */ }
    });
    activeOscillators = [];
  }, 700);
  isPlaying = false;
  soundToggle.classList.remove('active');
  soundToggle.setAttribute('aria-label', 'Activar sonido ambiental');
}

soundToggle.addEventListener('click', () => {
  if (isPlaying) stopAmbientSound();
  else startAmbientSound();
});
