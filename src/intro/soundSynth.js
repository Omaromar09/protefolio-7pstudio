/**
 * Minimal Web Audio Synthesizer for Deterministic Intro
 * Procedural percussion kicks & sweep hit without external audio files
 */

let audioCtx = null;
let isSoundEnabled = false;

export function initAudio() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass && !audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (e) {
    console.warn('AudioContext not allowed or supported', e);
  }
}

export function toggleAudio() {
  if (isSoundEnabled) {
    isSoundEnabled = false;
    return false;
  } else {
    initAudio();
    isSoundEnabled = true;
    return true;
  }
}

export function getAudioState() {
  return isSoundEnabled;
}

export function playIntroKick() {
  if (!isSoundEnabled) return;
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.09);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (err) {}
}

export function playIntroFloodHit() {
  if (!isSoundEnabled) return;
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  try {
    const now = audioCtx.currentTime;

    // Sub Bass Hit
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.3);

    // Rising Sweep Accent
    const sweep = audioCtx.createOscillator();
    const sweepGain = audioCtx.createGain();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(180, now);
    sweep.frequency.exponentialRampToValueAtTime(480, now + 0.14);

    sweepGain.gain.setValueAtTime(0.18, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    sweep.connect(sweepGain);
    sweepGain.connect(audioCtx.destination);

    sweep.start(now);
    sweep.stop(now + 0.2);
  } catch (err) {}
}


