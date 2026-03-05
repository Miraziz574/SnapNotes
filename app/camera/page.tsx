'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

type CameraState = 'idle' | 'streaming' | 'captured' | 'processing' | 'result' | 'error';

interface ExtractionResult {
  text: string;
  subject: string;
}

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CameraState>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const startCamera = useCallback(async (facing: 'environment' | 'user' = facingMode) => {
    // Stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState('streaming');
    } catch (err) {
      console.error('Camera error:', err);
      setError(
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Unable to access camera. Make sure your device has a camera and try again.'
      );
      setState('error');
    }
  }, [facingMode]);

  useEffect(() => {
    void startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setState('captured');

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const handleExtract = useCallback(async () => {
    if (!capturedImage) return;
    setState('processing');
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, mimeType: 'image/jpeg', save: true }),
      });
      const data = (await res.json()) as ExtractionResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'Extraction failed');
      }
      setResult({ text: data.text, subject: data.subject });
      setState('result');
      setSavedSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setState('error');
    }
  }, [capturedImage]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError('');
    setSavedSuccess(false);
    setState('idle');
    void startCamera(facingMode);
  }, [facingMode, startCamera]);

  const handleFlip = useCallback(async () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    await startCamera(next);
  }, [facingMode, startCamera]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/')}
          className="text-white/80 hover:text-white transition-colors p-2 -ml-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-white font-semibold text-lg tracking-tight">Capture</h1>
        {state === 'streaming' ? (
          <button
            onClick={handleFlip}
            className="text-white/80 hover:text-white transition-colors p-2 -mr-2"
            title="Flip camera"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.96" />
            </svg>
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Camera / Preview area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {(state === 'idle' || state === 'streaming') && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-lg aspect-video object-cover rounded-ios-lg"
          />
        )}

        {state === 'captured' && capturedImage && (
          <div className="relative w-full max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full aspect-video object-cover rounded-ios-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-ios-lg bg-black/20">
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                Preview
              </span>
            </div>
          </div>
        )}

        {state === 'processing' && (
          <div className="flex flex-col items-center gap-4 py-20">
            <LoadingSpinner size={48} />
            <p className="text-white/80 text-sm font-medium animate-pulse">
              Extracting text with AI…
            </p>
          </div>
        )}

        {state === 'result' && result && (
          <div className="w-full max-w-lg mx-auto px-4 animate-slide-up">
            <div className="bg-ios-surface dark:bg-ios-surface-dark rounded-ios-lg shadow-ios-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-semibold text-ios-green">
                    {savedSuccess ? 'Note saved!' : 'Extracted'}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {result.subject}
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <p className="text-sm leading-relaxed text-ios-label dark:text-ios-label-dark whitespace-pre-wrap">
                  {result.text}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(result.text);
                    } catch {
                      // Clipboard API unavailable; silently ignore
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-ios bg-blue-50 dark:bg-blue-900/20 text-ios-blue dark:text-ios-blue-dark text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Text
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-ios bg-ios-green/10 text-ios-green text-sm font-medium hover:bg-ios-green/20 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  View Notes
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="w-full max-w-lg mx-auto px-4 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-ios-lg p-5 space-y-3 text-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-ios-red font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom controls */}
      <div className="pb-8 pt-6 flex items-center justify-center gap-8">
        {state === 'streaming' && (
          <button
            onClick={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 active:scale-95 transition-all duration-150 shadow-ios-lg flex items-center justify-center"
            title="Capture"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-inner" />
          </button>
        )}

        {state === 'captured' && (
          <div className="flex items-center gap-6">
            <button
              onClick={handleRetake}
              className="px-6 py-3 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Retake
            </button>
            <button
              onClick={handleExtract}
              className="px-8 py-3 rounded-full bg-ios-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-ios"
            >
              Extract Text
            </button>
          </div>
        )}

        {(state === 'result' || state === 'error') && (
          <button
            onClick={handleRetake}
            className="px-8 py-3 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            New Capture
          </button>
        )}

        {(state === 'idle' || state === 'processing') && (
          <div className="h-20" />
        )}
      </div>
    </div>
  );
}
