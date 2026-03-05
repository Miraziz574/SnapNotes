import { useState, useCallback } from 'react';

interface OCRResult {
  text: string;
  confidence: number;
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (imageData: string): Promise<OCRResult | null> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(imageData);
      await worker.terminate();

      return {
        text: data.text.trim(),
        confidence: Math.round(data.confidence),
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
      return null;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  return { processImage, isProcessing, progress, error };
}
