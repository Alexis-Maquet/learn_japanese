import { useEffect, useState, useMemo } from 'react';
import { useKanjiStore } from '@/store/kanjiStore';
import { JlptBadge } from '@/components/kanji/JlptBadge';
import { SpeakButton } from '@/components/kanji/SpeakButton';
import { AddToListModal } from '@/components/lists/AddToListModal';
import { KanjiDetailModal } from './KanjiDetailModal';
import { jlptNumericToLabel } from '@/utils/domains';
import { getWordDefinition, getApiKey } from '@/utils/geminiVision';
import type { KanjiDetails } from '@/types';

interface KanjiCardProps {
  kanji: string;
  onClick: (k: string) => void;
}

function KanjiCard({ kanji, onClick }: KanjiCardProps) {
  const { details, loadDetails } = useKanjiStore();
  const d: KanjiDetails | undefined = details[kanji];

  useEffect(() => { loadDetails(kanji); }, [kanji, loadDetails]);

  const jlpt = d ? jlptNumericToLabel(d.jlpt) : null;

  return (
    <button
      onClick={() => onClick(kanji)}
      className="card p-3 flex flex-col items-center gap-1.5 hover:border-japan-red transition-all group cursor-pointer w-full"
    >
      <span className="text-4xl kanji-char leading-none text-white group-hover:text-japan-red transition-colors">
        {kanji}
      </span>
      <JlptBadge level={jlpt} />
      {d ? (
        <p className="text-xs text-gray-400 text-center line-clamp-2 leading-relaxed">
          {d.meanings.slice(0, 2).join(', ')}
        </p>
      ) : (
        <div className="w-full h-3 bg-[#21262d] rounded animate-pulse" />
      )}
    </button>
  );
}

interface WordGroupProps {
  word: string;
  onKanjiClick: (k: string) => void;
}

function KanjiWordGroup({ word, onKanjiClick }: WordGroupProps) {
  const { kanjiWords, loadWords } = useKanjiStore();
  const chars = useMemo(() => [...word], [word]);
  const [geminiDef, setGeminiDef] = useState<{ reading: string; meaning: string } | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    chars.forEach((k) => loadWords(k));
  }, [word, chars, loadWords]);

  const allLoaded = useMemo(() => chars.every(k => kanjiWords[k] !== undefined), [chars, kanjiWords]);

  const definition = useMemo(() => {
    for (const k of chars) {
      const entries = kanjiWords[k] ?? [];
      const match =
        entries.find((e) => e.word === word) ??
        entries.find((e) => e.word.length > 1 && e.word.startsWith(word));
      if (match) return match;
    }
    return null;
  }, [word, chars, kanjiWords]);

  useEffect(() => {
    if (!allLoaded || definition !== null || geminiDef !== null || geminiLoading) return;
    const apiKey = getApiKey();
    if (!apiKey) return;
    setGeminiLoading(true);
    getWordDefinition(apiKey, word)
      .then(d => { if (d) setGeminiDef(d); })
      .finally(() => setGeminiLoading(false));
  }, [allLoaded, definition, word, geminiDef, geminiLoading]);

  const displayDef = definition ?? geminiDef;

  return (
    <div className="card p-4 space-y-3">
      {/* Word header with definition */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <span className="kanji-char text-2xl text-white">{word}</span>
          {displayDef && <SpeakButton text={word} />}
        </div>
        {geminiLoading ? (
          <div className="flex items-center gap-2 self-center">
            <span className="w-3 h-3 border border-gray-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-600">Gemini…</span>
          </div>
        ) : displayDef ? (
          <div className="flex-1 min-w-0">
            <p className="kanji-char text-base text-gray-400 leading-tight">{displayDef.reading}</p>
            <p className="text-sm text-gray-300 mt-0.5">{displayDef.meaning}</p>
            {!definition && geminiDef && (
              <span className="text-xs text-gray-600">✨ Gemini</span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-600 italic self-center">définition non trouvée</p>
        )}
      </div>

      {/* Individual kanji cards */}
      <div className="flex flex-wrap gap-2">
        {chars.map((k) => (
          <div key={k} className="w-[88px]">
            <KanjiCard kanji={k} onClick={onKanjiClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  words: string[];
}

export function KanjiAnalysis({ words }: Props) {
  const [showAddToList, setShowAddToList] = useState(false);
  const [selectedKanji, setSelectedKanji] = useState<string | null>(null);

  const allKanjis = useMemo(() => [...new Set(words.flatMap((w) => [...w]))], [words]);

  if (words.length === 0) {
    return <p className="text-gray-500 text-sm italic">Aucun kanji détecté dans ce texte.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          <span className="text-white font-semibold">{words.length}</span>{' '}
          mot{words.length > 1 ? 's' : ''} en kanji —{' '}
          <span className="text-white font-semibold">{allKanjis.length}</span>{' '}
          kanji{allKanjis.length > 1 ? 's' : ''} uniques
        </p>
        <button
          onClick={() => setShowAddToList(true)}
          className="btn-secondary text-xs flex items-center gap-1.5"
        >
          <span>+</span>
          <span>Ajouter à une liste</span>
        </button>
      </div>

      <div className="space-y-3">
        {words.map((word) => (
          <KanjiWordGroup key={word} word={word} onKanjiClick={setSelectedKanji} />
        ))}
      </div>

      {showAddToList && (
        <AddToListModal kanjis={allKanjis} onClose={() => setShowAddToList(false)} />
      )}
      {selectedKanji && (
        <KanjiDetailModal kanji={selectedKanji} onClose={() => setSelectedKanji(null)} />
      )}
    </div>
  );
}
