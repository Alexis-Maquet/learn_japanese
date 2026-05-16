import { useState, useEffect, useCallback } from 'react';
import { getKanjiVGUrl } from '../../utils/api';
import { parseKanjiVGSvg } from '../../utils/strokeOrder';

interface StrokePath {
  d: string;
  index: number;
}

interface Props {
  kanji: string;
}

export function StrokeOrder({ kanji }: Props) {
  const [strokes, setStrokes] = useState<StrokePath[]>([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewBox, setViewBox] = useState('0 0 109 109');

  useEffect(() => {
    setLoading(true);
    setError(false);
    setStrokes([]);
    setCurrent(0);
    setPlaying(false);

    fetch(getKanjiVGUrl(kanji))
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.text();
      })
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (svgEl) setViewBox(svgEl.getAttribute('viewBox') ?? '0 0 109 109');
        const parsed = parseKanjiVGSvg(text);
        setStrokes(parsed);
        setCurrent(parsed.length);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [kanji]);

  const step = useCallback(() => {
    setCurrent((c) => {
      if (c < strokes.length) return c + 1;
      setPlaying(false);
      return c;
    });
  }, [strokes.length]);

  useEffect(() => {
    if (!playing) return;
    if (current >= strokes.length) { setPlaying(false); return; }
    const t = setTimeout(step, 600);
    return () => clearTimeout(t);
  }, [playing, current, step, strokes.length]);

  const playAnimation = () => {
    setCurrent(0);
    setPlaying(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-2 border-japan-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || strokes.length === 0) return (
    <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
      Ordre des traits non disponible
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-3 flex items-center justify-center" style={{ maxWidth: 220, margin: '0 auto' }}>
        <svg viewBox={viewBox} width="200" height="200" className="stroke-order-svg">
          {strokes.map((s, i) => (
            <path
              key={i}
              d={s.d}
              className={
                i < current
                  ? i === current - 1
                    ? 'active'
                    : ''
                  : 'dimmed'
              }
            />
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => { setCurrent(0); setPlaying(false); }}
          className="btn-secondary text-xs px-3 py-1.5"
          disabled={current === 0}
        >
          ↩ Reset
        </button>
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="btn-secondary text-xs px-3 py-1.5"
          disabled={current === 0}
        >
          ← Préc.
        </button>
        <span className="text-sm text-gray-400 min-w-[60px] text-center">
          {current} / {strokes.length}
        </span>
        <button
          onClick={() => setCurrent((c) => Math.min(strokes.length, c + 1))}
          className="btn-secondary text-xs px-3 py-1.5"
          disabled={current >= strokes.length}
        >
          Suiv. →
        </button>
        <button
          onClick={playAnimation}
          className="btn-primary text-xs px-3 py-1.5"
          disabled={playing}
        >
          {playing ? '⏳ Animation...' : '▶ Animer'}
        </button>
        <button
          onClick={() => setCurrent(strokes.length)}
          className="btn-secondary text-xs px-3 py-1.5"
          disabled={current >= strokes.length}
        >
          Tout afficher
        </button>
      </div>
    </div>
  );
}
