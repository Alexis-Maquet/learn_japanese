import { useRef, useEffect } from 'react';
import type { SupportedMediaType } from '@/utils/geminiVision';

export interface CapturedImage {
  dataUrl: string;
  base64: string;
  mediaType: SupportedMediaType;
}

interface Props {
  onCapture: (img: CapturedImage) => void;
}

const MAX_SIZE = 1536;

function resizeToJpeg(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
}

async function fileToCapture(file: File): Promise<CapturedImage> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const dataUrl = await resizeToJpeg(raw);
  const [, base64] = dataUrl.split(',');
  return { dataUrl, base64, mediaType: 'image/jpeg' };
}

export function ImageCapture({ onCapture }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) onCapture(await fileToCapture(file));
          break;
        }
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [onCapture]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(await fileToCapture(file));
    e.target.value = '';
  };

  return (
    <div className="flex flex-wrap gap-3">
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <button onClick={() => cameraInputRef.current?.click()} className="btn-primary flex items-center gap-2 text-sm">
        <span>📷</span>
        <span>Appareil photo</span>
      </button>

      <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-2 text-sm">
        <span>🖼️</span>
        <span>Importer image</span>
      </button>

      <div className="btn-secondary flex items-center gap-2 text-sm text-gray-500 cursor-default select-none">
        <span>📋</span>
        <span>Ctrl+V pour coller</span>
      </div>
    </div>
  );
}
