import { useEffect, useRef, useState } from 'react';

/** Picks Spanish voices from the browser (Spain first), and speaks lines one after another. */
export function useSpanishSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('es'));
      all.sort((a, b) => Number(b.lang.toLowerCase() === 'es-es') - Number(a.lang.toLowerCase() === 'es-es'));
      setVoices(all);
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const stop = () => {
    if (!supported) return;
    cancelled.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentLine(null);
  };

  /** Speaks each line in turn. Speaker "B" gets a second voice (or a different pitch) so dialogues are easy to follow. */
  const speak = (lines: { speaker?: 'A' | 'B'; text: string }[], rate = 0.9, startAt = 0, onlyOne = false) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    cancelled.current = false;
    setSpeaking(true);
    const voiceA = voices[0];
    const voiceB = voices.find(v => v !== voiceA && v.lang.toLowerCase().startsWith('es')) || voiceA;
    const sayLine = (i: number) => {
      const last = onlyOne ? startAt : lines.length - 1;
      if (cancelled.current || i > last) {
        setSpeaking(false);
        setCurrentLine(null);
        return;
      }
      const line = lines[i];
      const u = new SpeechSynthesisUtterance(line.text);
      u.lang = 'es-ES';
      u.rate = rate;
      const isB = line.speaker === 'B';
      const voice = isB ? voiceB : voiceA;
      if (voice) u.voice = voice;
      if (isB && voiceB === voiceA) u.pitch = 0.7;
      u.onstart = () => setCurrentLine(i);
      u.onend = () => setTimeout(() => sayLine(i + 1), 450);
      u.onerror = () => { setSpeaking(false); setCurrentLine(null); };
      window.speechSynthesis.speak(u);
    };
    sayLine(startAt);
  };

  return { supported, hasSpanishVoice: voices.length > 0, speaking, currentLine, speak, stop };
}
