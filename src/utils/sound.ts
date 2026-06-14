let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playNote(ac: AudioContext, freq: number, startTime: number, duration: number): void {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0.0, startTime);
  gain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playCorrect(): void {
  try {
    const ac = getCtx();
    playNote(ac, 523, ac.currentTime, 0.09);        // Do5
    playNote(ac, 659, ac.currentTime + 0.11, 0.12); // Mi5
  } catch {
    // silently ignore if Web Audio API is unavailable
  }
}
