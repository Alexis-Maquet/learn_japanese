import { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { ImageCapture, type CapturedImage } from '@/components/scan/ImageCapture';
import { KanjiAnalysis } from '@/components/scan/KanjiAnalysis';
import { extractKanji, highlightKanjiInText } from '@/utils/kanjiExtract';
import { extractTextWithGemini, getApiKey, saveApiKey, clearApiKey, getRemainingCalls } from '@/utils/geminiVision';

type OcrStatus = 'idle' | 'loading' | 'done' | 'error';
type GeminiStatus = 'idle' | 'loading' | 'done' | 'error';

const OCR_PHASE_LABELS: Record<string, string> = {
  'initializing tesseract': 'Initialisation…',
  'loading language traineddata': 'Téléchargement modèle japonais (~20 Mo)…',
  'initializing api': 'Préparation du moteur…',
  'recognizing text': 'Reconnaissance en cours…',
};

export function ScanPage() {
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrPhase, setOcrPhase] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [geminiText, setGeminiText] = useState('');
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus>('idle');
  const [geminiError, setGeminiError] = useState('');
  const [activeSource, setActiveSource] = useState<'tesseract' | 'gemini'>('tesseract');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [remainingCalls, setRemainingCalls] = useState(() => getRemainingCalls());
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);

  const handleCapture = useCallback((img: CapturedImage) => {
    setImage(img);
    setOcrText('');
    setOcrStatus('idle');
    setOcrProgress(0);
    setOcrPhase('');
    setOcrError('');
    setGeminiText('');
    setGeminiStatus('idle');
    setGeminiError('');
    setActiveSource('tesseract');
  }, []);

  const runTesseract = async () => {
    if (!image) return;
    setOcrStatus('loading');
    setOcrProgress(0);
    setOcrPhase('Initialisation…');
    setOcrError('');
    try {
      if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
      }
      const worker = await createWorker('jpn', 1, {
        logger: (m: { status: string; progress: number }) => {
          const label = OCR_PHASE_LABELS[m.status] ?? m.status;
          setOcrPhase(label);
          setOcrProgress(Math.round(m.progress * 100));
        },
      });
      workerRef.current = worker;
      const { data } = await worker.recognize(image.dataUrl);
      setOcrText(data.text.trim());
      setOcrStatus('done');
      setOcrPhase('');
      if (data.text.trim()) setActiveSource('tesseract');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setOcrError(msg);
      setOcrStatus('error');
    }
  };

  const runGemini = async (key?: string) => {
    if (!image) return;
    const apiKey = key ?? getApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setGeminiStatus('loading');
    setGeminiError('');
    try {
      const text = await extractTextWithGemini(apiKey, image.base64, image.mediaType);
      setGeminiText(text);
      setGeminiStatus('done');
      setActiveSource('gemini');
      setRemainingCalls(getRemainingCalls());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('429') || msg.includes('quota')) {
        setGeminiError(
          'Quota dépassé ou tier gratuit non disponible (limit: 0). ' +
          'Assurez-vous que votre clé provient de aistudio.google.com et non de Google Cloud Console. ' +
          'Sur Cloud Console, la facturation désactive le tier gratuit.'
        );
      } else {
        setGeminiError(msg);
      }
      if (msg.includes('401') || msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || msg.includes('auth')) {
        clearApiKey();
        setShowApiKeyModal(true);
      }
      setGeminiStatus('error');
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setApiKeyError('La clé ne peut pas être vide');
      return;
    }
    saveApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
    setApiKeyInput('');
    setApiKeyError('');
    runGemini(apiKeyInput.trim());
  };

  const hasApiKey = !!getApiKey();
  const activeText = activeSource === 'gemini' && geminiText ? geminiText : ocrText;
  const kanjis = extractKanji(activeText);
  const segments = activeText ? highlightKanjiInText(activeText) : [];
  const showSourceToggle = !!(ocrText && geminiText);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white">Scanner des kanjis</h1>
        <span className="text-gray-500 text-sm">OCR + analyse</span>
      </div>

      {/* Capture */}
      <div className="card p-5 space-y-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Capture d'image</h2>
        <ImageCapture onCapture={handleCapture} />

        {image && (
          <div className="mt-3">
            <img
              src={image.dataUrl}
              alt="Image capturée"
              className="max-h-64 rounded-lg border border-[#30363d] object-contain"
            />
          </div>
        )}
      </div>

      {/* OCR */}
      {image && (
        <div className="card p-5 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Reconnaissance de texte</h2>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Tesseract */}
            <button
              onClick={runTesseract}
              disabled={ocrStatus === 'loading'}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {ocrStatus === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="truncate max-w-[200px]">{ocrPhase || 'Chargement…'}{ocrProgress > 0 ? ` ${ocrProgress}%` : ''}</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Analyser (Tesseract)</span>
                </>
              )}
            </button>

            {/* Gemini + modifier clé */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => runGemini()}
                disabled={geminiStatus === 'loading'}
                className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {geminiStatus === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Gemini analyse...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>
                      {geminiStatus === 'done' ? 'Relancer Gemini' : 'Analyser avec Gemini'}
                      {!hasApiKey && ' (clé requise)'}
                    </span>
                  </>
                )}
              </button>
              {hasApiKey && (
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  title="Modifier la clé API Gemini"
                  className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                >
                  ⚙️
                </button>
              )}
            </div>
          </div>

          {/* Remaining calls */}
          {hasApiKey && (
            <p className="text-xs text-gray-600">
              {remainingCalls.toLocaleString()} appels Gemini restants aujourd'hui (sur 1 500)
            </p>
          )}

          {ocrStatus === 'error' && (
            <div className="text-red-400 text-sm space-y-1">
              <p>Erreur lors de la reconnaissance.</p>
              {ocrError && <p className="text-xs text-red-500 font-mono break-all">{ocrError}</p>}
              <p className="text-xs text-gray-500">Vérifiez que l'image est lisible et que la connexion est active (premier chargement : ~20 Mo).</p>
            </div>
          )}

          {ocrStatus === 'done' && !ocrText && (
            <p className="text-sm text-gray-500">
              Aucun texte japonais détecté. Qualité ou orientation de l'image insuffisante — essayez avec Gemini.
            </p>
          )}

          {geminiStatus === 'error' && (
            <div className="text-red-400 text-sm space-y-1">
              <p>Erreur Gemini API.</p>
              {geminiError && <p className="text-xs text-red-500 font-mono break-all">{geminiError}</p>}
            </div>
          )}

          {/* Source toggle */}
          {showSourceToggle && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Source :</span>
              <button
                onClick={() => setActiveSource('tesseract')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  activeSource === 'tesseract' ? 'bg-japan-red text-white' : 'bg-[#21262d] text-gray-400 hover:text-white'
                }`}
              >
                Tesseract
              </button>
              <button
                onClick={() => setActiveSource('gemini')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  activeSource === 'gemini' ? 'bg-japan-red text-white' : 'bg-[#21262d] text-gray-400 hover:text-white'
                }`}
              >
                Gemini
              </button>
            </div>
          )}

          {/* Extracted text */}
          {activeText && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Texte extrait :</p>
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-base leading-relaxed font-mono">
                {segments.map((seg, i) =>
                  seg.isKanji ? (
                    <span key={i} className="text-japan-red font-semibold bg-japan-red/10 rounded px-0.5">
                      {seg.text}
                    </span>
                  ) : (
                    <span key={i} className="text-gray-300">
                      {seg.text}
                    </span>
                  )
                )}
              </div>
              <p className="text-xs text-gray-600">Les kanji sont surlignés en rouge.</p>
            </div>
          )}
        </div>
      )}

      {/* Kanji analysis */}
      {kanjis.length > 0 && (
        <div className="card p-5 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-medium">Kanji détectés</h2>
          <KanjiAnalysis kanjis={kanjis} />
        </div>
      )}

      {/* API key modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Clé API Gemini</h3>
            <p className="text-sm text-gray-400">
              {hasApiKey
                ? 'Entrez une nouvelle clé pour remplacer celle enregistrée, ou supprimez-la.'
                : 'Entrez votre clé API Google Gemini. Elle sera stockée localement dans votre navigateur.'}
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-japan-red hover:underline inline-block"
            >
              Obtenir une clé gratuite sur aistudio.google.com →
            </a>
            <input
              type="password"
              placeholder="AIza..."
              value={apiKeyInput}
              onChange={(e) => { setApiKeyInput(e.target.value); setApiKeyError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-japan-red"
              autoFocus
            />
            {apiKeyError && <p className="text-red-400 text-xs">{apiKeyError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowApiKeyModal(false); setApiKeyInput(''); setApiKeyError(''); }}
                className="btn-secondary text-sm"
              >
                Annuler
              </button>
              <button onClick={handleSaveApiKey} className="btn-primary text-sm">
                Enregistrer et analyser
              </button>
            </div>
            {hasApiKey && (
              <button
                onClick={() => { clearApiKey(); setShowApiKeyModal(false); }}
                className="text-xs text-gray-600 hover:text-red-400 w-full text-center"
              >
                Supprimer la clé enregistrée
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
