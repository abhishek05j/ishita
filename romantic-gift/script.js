// ── GLOBAL EMOJI BACKGROUND ──
const emojis = ['💖', '💕', '🌸', '🫶', '✨', '💗', '🌹', '🐻', '😭'];
const emojisContainer = document.getElementById('floating-emojis');

function spawnEmojis() {
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${10 + Math.random() * 15}s`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    el.style.fontSize = `${1.5 + Math.random() * 1.5}rem`;
    emojisContainer.appendChild(el);
  }
}
spawnEmojis();

// ── PAGE NAVIGATION ──
const pages = {
  landing: document.getElementById('landing-page'),
  password: document.getElementById('password-page'),
  camera: document.getElementById('camera-page'),
  letter: document.getElementById('letter-page')
};

function showPage(pageId) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[pageId].classList.add('active');
}

// ── MUSIC PLAYER ──
const audio = document.getElementById('audio-player');
const toggleBtn = document.getElementById('music-toggle');
const panel = document.getElementById('music-panel');
const vinyl = document.getElementById('vinyl');
const btnPlay = document.getElementById('btn-play');
const btnRewind = document.getElementById('btn-rewind');
const btnForward = document.getElementById('btn-forward');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const volumeSlider = document.getElementById('volume-slider');

let isPlaying = false;

// Format time utility
function formatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Attempt autoplay on first user interaction
const tryAutoplay = () => {
  audio.play().then(() => {
    updatePlayState(true);
    document.removeEventListener('click', tryAutoplay);
  }).catch(() => {});
};
document.addEventListener('click', tryAutoplay, { once: true });

function updatePlayState(playing) {
  isPlaying = playing;
  if (playing) {
    audio.play().catch(()=>{});
    toggleBtn.classList.add('playing');
    vinyl.classList.add('spinning');
    btnPlay.textContent = '⏸';
  } else {
    audio.pause();
    toggleBtn.classList.remove('playing');
    vinyl.classList.remove('spinning');
    btnPlay.innerHTML = `<span style="margin-left: 3px;">▶</span>`;
  }
}

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  panel.classList.toggle('open');
  if (!isPlaying) updatePlayState(true);
});

btnPlay.addEventListener('click', () => updatePlayState(!isPlaying));
btnRewind.addEventListener('click', () => audio.currentTime -= 10);
btnForward.addEventListener('click', () => audio.currentTime += 10);

audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  timeCurrent.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
});

volumeSlider.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});
audio.volume = 0.7;


// ── 1. LANDING PAGE LOGIC ──
const landingText = "Hello Mera Cute Baccha 💖✨";
const landingEl = document.getElementById('landing-text');
const landingBtn = document.getElementById('landing-btn');

let i = 0;
function typeLanding() {
  if (i < landingText.length) {
    landingEl.textContent += landingText.charAt(i);
    i++;
    setTimeout(typeLanding, 100);
  } else {
    setTimeout(() => landingBtn.classList.add('visible'), 500);
  }
}
setTimeout(typeLanding, 1000);

landingBtn.addEventListener('click', () => {
  showPage('password');
});


// ── 2. PASSWORD PAGE LOGIC ──
const passTitle = document.getElementById('password-title');
const dots = document.querySelectorAll('.pass-dot');
const keypad = document.getElementById('keypad');
const CORRECT_PASS = '1204';
let currentInput = '';

const layout = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'];
layout.forEach(key => {
  const btn = document.createElement('button');
  btn.className = `key ${key === '' ? 'empty' : ''}`;
  btn.textContent = key;
  if (key !== '') {
    btn.addEventListener('click', () => handleKeyPress(key));
  }
  keypad.appendChild(btn);
});

function handleKeyPress(key) {
  if (passTitle.textContent === 'Come In, Ishita 💖') return;

  if (key === '⌫') {
    currentInput = currentInput.slice(0, -1);
  } else if (currentInput.length < 4) {
    currentInput += key;
  }
  updateDots();

  if (currentInput.length === 4) {
    if (currentInput === CORRECT_PASS) {
      passTitle.textContent = 'Come In, Ishita 💖';
      passTitle.style.color = '#ff6b9d';
      setTimeout(() => {
        showPage('camera');
        initCamera();
      }, 1500);
    } else {
      passTitle.textContent = 'Wrong Passcode ❌';
      passTitle.style.color = '#ff4a4a';
      setTimeout(() => {
        currentInput = '';
        updateDots();
        passTitle.textContent = 'Enter Passcode';
        passTitle.style.color = 'white';
      }, 1000);
    }
  }
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle('filled', index < currentInput.length);
  });
}


// ── 3. CAMERA PAGE LOGIC ──
let videoStream = null;

async function initCamera() {
  const video = document.getElementById('camera-video');
  const emojiContainer = document.getElementById('camera-emojis');
  const cameraEmojis = ['💖', '💕', '🌸', '✨', '🫶', '💗'];

  // Spawn localized emojis in the camera frame
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = cameraEmojis[Math.floor(Math.random() * cameraEmojis.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${5 + Math.random() * 10}s`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    el.style.fontSize = `${1.2 + Math.random()}rem`;
    emojiContainer.appendChild(el);
  }

  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = videoStream;
  } catch (err) {
    console.error("Camera access denied or unavailable", err);
    // Fallback if camera fails
    document.querySelector('.camera-overlay-text').textContent = "I couldn't open the camera, but I know you look beautiful anyway 💖✨";
  }
}

document.getElementById('capture-btn').addEventListener('click', () => {
  const flash = document.getElementById('camera-flash');
  
  // Flash effect
  flash.style.opacity = '1';
  
  setTimeout(() => {
    // Stop camera stream to save battery and turn off light
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    
    // Transition to letter page
    showPage('letter');
    flash.style.opacity = '0';
    startLetterSequence();
  }, 500);
});


// ── 4. LETTER PAGE LOGIC ──
const letterContent = `
  My dearest baccha,

  You know I'm not the best with words, but I wanted to do something special for you to remind you just how much you mean to me.
  
  Ever since you came into my life, everything just feels brighter. Even the smallest moments with you become my favorite memories.
  
  I might not say it perfectly, but every time I look at you, my heart flutters because you make my life happier and more beautiful every single day 💕.
  
  Thank you for being you. Thank you for being mine.
  
  Yours always,
  Navjot 💌
`;

const letterContainer = document.getElementById('letter-text-container');

function startLetterSequence() {
  // Spawn falling rose petals
  setInterval(() => {
    const petal = document.createElement('div');
    petal.textContent = '🌹';
    petal.style.position = 'fixed';
    petal.style.top = '-20px';
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.fontSize = `${Math.random() * 1.5 + 0.5}rem`;
    petal.style.opacity = Math.random();
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = '9';
    petal.style.transition = 'top 4s linear, transform 4s linear';
    
    document.body.appendChild(petal);
    
    setTimeout(() => {
      petal.style.top = '100vh';
      petal.style.transform = `rotate(${Math.random() * 360 + 360}deg)`;
    }, 50);

    setTimeout(() => petal.remove(), 4000);
  }, 300);

  // Type letter
  let letterIndex = 0;
  function typeLetter() {
    if (letterIndex < letterContent.length) {
      if (letterContent.charAt(letterIndex) === '\n') {
        letterContainer.innerHTML += '<br>';
      } else {
        letterContainer.innerHTML += letterContent.charAt(letterIndex);
      }
      letterIndex++;
      setTimeout(typeLetter, 40);
    }
  }
  setTimeout(typeLetter, 1000);
}
