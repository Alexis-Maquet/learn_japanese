import { useState } from 'react';

interface Props {
  text: string;
  className?: string;
}

// Kun-yomi readings use '.' as an okurigana separator (e.g. 'き.く' → 'きく').
// TTS engines interpret '.' as punctuation and may fail or pause unexpectedly.
function cleanForTTS(text: string): string {
  return text.replace(/\./g, '');
}

export function SpeakButton({ text, className = '' }: Props) {
  const [state, setState] = useState<'idle' | 'speaking' | 'error'>('idle');

  const handleClick = () => {
    if (!('speechSynthesis' in window)) {
      setState('error');
      return;
    }

    const ss = window.speechSynthesis;

    if (state === 'speaking') {
      ss.cancel();
      setState('idle');
      return;
    }

    const u = new SpeechSynthesisUtterance(cleanForTTS(text));
    u.lang = 'ja-JP';
    u.rate = 0.9;
    u.onend = () => setState('idle');
    u.onerror = (e) => {
      console.warn('[SpeakButton] onerror:', e.error, 'text:', text);
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    };

    // Firefox queues utterances but won't play them if the synthesizer is
    // paused. cancel() clears any stuck queue, resume() un-pauses the engine.
    ss.cancel();

    const voices = ss.getVoices();
    const preferred = voices.find(v => v.name === 'Microsoft Ayumi - Japanese (Japan)');
    const fallback = voices.find(v => v.lang.startsWith('ja'));
    if (preferred ?? fallback) u.voice = preferred ?? fallback!;

    ss.speak(u);
    ss.resume();

    setState('speaking'); // Optimistic: revert via onend/onerror if needed
  };

  const icon = state === 'speaking' ? '🔉' : state === 'error' ? '⚠️' : '🔊';
  const title =
    state === 'speaking' ? 'Arrêter' :
    state === 'error' ? 'Erreur TTS' :
    'Écouter';

  return (
    <button
      onClick={handleClick}
      className={`transition-colors leading-none ${
        state === 'speaking' ? 'text-blue-400' :
        state === 'error' ? 'text-red-400' :
        'text-gray-500 hover:text-white'
      } ${className}`}
      title={title}
      type="button"
    >
      {icon}
    </button>
  );
}
