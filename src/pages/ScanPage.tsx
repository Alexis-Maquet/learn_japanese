import { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { ImageCapture, type CapturedImage } from '@/components/scan/ImageCapture';
import { KanjiAnalysis } from '@/components/scan/KanjiAnalysis';
import { extractKanji, highlightKanjiInText } from '@/utils/kanjiExtract';
import { extractTextWithClaude, getApiKey, saveApiKey, clearApiKey } from '@/utils/claudeVision';

type OcrStatus = 'idle' | 'loading' | 'done' | 'error';
type ClaudeStatus = 'idle' | 'loading' | 'done' | 'error';

export function ScanPage() {
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [claudeText, setClaudeText] = useState('');
  const [claudeStatus, setClaudeStatus] = useState<ClaudeStatus>('idle');
  const [activeSource, setActiveSource] = useState<'tesseract' | 'claude'>('tesseract');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const workerRef = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null);

  const handleCapture = useCallback((img: CapturedImage) => {
    setImage(img);
    setOcrText('');
    setOcrStatus('idle');
    setOcrProgress(0);
    setClaudeText('');
    setClaudeStatus('idle');
    setActiveSource('tesseract');
  }, []);

  const runTesseract = async () => {
    if (!image) return;
    setOcrStatus('loading');
    setOcrProgress(0);
    try {
      if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
      }
      const worker = await createWorker('jpn', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      workerRef.current = worker;
      const { data } = await worker.recognize(image.dataUrl);
      setOcrText(data.text.trim());
      setOcrStatus('done');
      setActiveSource('tesseract');
    } catch {
      setOcrStatus('error');
    }
  };

  const runClaude = async (key?: string) => {
    if (!image) return;
    const apiKey = key ?? getApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setClaudeStatus('loading');
    try {
      const text = await extractTextWithClaude(apiKey, image.base64, image.mediaType);
      setClaudeText(text);
      setClaudeStatus('done');
      setActiveSource('claude');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('401') || msg.includes('auth')) {
        clearApiKey();
        setShowApiKeyModal(true);
      }
      setClaudeStatus('error');
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim() || !apiKeyInput.startsWith('sk-')) {
      setApiKeyError('La clé doit commencer par "sk-"');
      return;
    }
    saveApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
    setApiKeyInput('');
    setApiKeyError('');
    runClaude(apiKeyInput.trim());
  };

  const activeText = activeSource === 'claude' && claudeText ? claudeText : ocrText;
  const kanjis = extractKanji(activeText);
  const segments = activeText ? highlightKanjiInText(activeText) : [];
  const hasApiKey = !!getApiKey();

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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={runTesseract}
              disabled={ocrStatus === 'loading'}
              className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {ocrStatus === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyse... {ocrProgress > 0 ? `${ocrProgress}%` : ''}</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Analyser (Tesseract)</span>
                </>
              )}
            </button>

            {ocrStatus === 'done' && (
              <button
                onClick={() => runClaude()}
                disabled={claudeStatus === 'loading'}
                className="btn-secondary text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {claudeStatus === 'loading' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Claude analyse...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>
                      {claudeStatus === 'done' ? 'Relancer Claude API' : 'Confirmer avec Claude API'}
                      {!hasApiKey && ' (clé requise)'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          {ocrStatus === 'error' && (
            <p className="text-red-400 text-sm">Erreur lors de la reconnaissance. Vérifiez que l'image est lisible.</p>
          )}

          {claudeStatus === 'error' && (
            <p className="text-red-400 text-sm">Erreur Claude API. Vérifiez votre clé API.</p>
          )}

          {/* Source toggle */}
          {ocrText && claudeText && (
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
                onClick={() => setActiveSource('claude')}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  activeSource === 'claude' ? 'bg-japan-red text-white' : 'bg-[#21262d] text-gray-400 hover:text-white'
                }`}
              >
                Claude API
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
              <p className="text-xs text-gray-600">
                Les kanji sont surlignés en rouge.
              </p>
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
            <h3 className="text-lg font-bold text-white">Clé API Claude</h3>
            <p className="text-sm text-gray-400">
              Entrez votre clé API Anthropic pour utiliser la reconnaissance Claude.
              Elle sera stockée localement dans votre navigateur.
            </p>
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-japan-red hover:underline inline-block"
            >
              Obtenir une clé sur console.anthropic.com →
            </a>
            <input
              type="password"
              placeholder="sk-ant-..."
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
