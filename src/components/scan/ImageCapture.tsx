import { useRef, useEffect } from 'react';
import type { SupportedMediaType } from '@/utils/claudeVision';

export interface CapturedImage {
  dataUrl: string;
  base64: string;
  mediaType: SupportedMediaType;
}

interface Props {
  onCapture: (img: CapturedImage) => void;
}

function fileToCapture(file: File): Promise<CapturedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mediaType = (header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg') as SupportedMediaType;
      resolve({ dataUrl, base64, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => cameraInputRef.current?.click()}
        className="btn-primary flex items-center gap-2 text-sm"
      >
        <span>📷</span>
        <span>Appareil photo</span>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
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
