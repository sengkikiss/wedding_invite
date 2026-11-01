import { wedding as W } from './data/wedding.js';

let audio = null;
let isPlaying = false;
let listeners = [];

export function initAudio() {
  if (!W.music) return;
  if (!audio) {
    audio = new Audio(W.music);
    audio.loop = true;
    audio.volume = 0.65;
    audio.preload = 'auto';

    audio.addEventListener('play', () => {
      isPlaying = true;
      notify();
    });
    audio.addEventListener('pause', () => {
      isPlaying = false;
      notify();
    });
    audio.addEventListener('ended', () => {
      isPlaying = false;
      notify();
    });
  }
}

export function playAudio() {
  initAudio();
  if (!audio) return Promise.resolve();
  return audio.play().then(() => {
    isPlaying = true;
    notify();
  }).catch((err) => {
    console.log('Audio autoplay prevented or waiting for interaction:', err);
  });
}

export function pauseAudio() {
  if (audio) {
    audio.pause();
    isPlaying = false;
    notify();
  }
}

export function toggleAudio() {
  if (!audio) initAudio();
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
  return isPlaying;
}

export function getAudioState() {
  return isPlaying;
}

export function onAudioStateChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

function notify() {
  listeners.forEach((fn) => fn(isPlaying));
}

