import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Check, Zap } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import { autoTag } from '../utils/aiUtils';
import { captureImageWithAI } from '../utils/imageProcessing';
import { apiUrl } from '../utils/api';
import { Button } from '../components/UI/Button';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { Header } from '../components/Layout/Header';

interface CameraPageProps {
  onMenuClick: () => void;
}

export function CameraPage({ onMenuClick }: CameraPageProps) {
  const navigate = useNavigate();
  const { addNote, addToast } = useNotesStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [aiImageFilename, setAiImageFilename] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      addToast('Camera access denied. Please use file upload instead.', 'error');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    canvas.toBlob((blob) => {
      if (blob) setCapturedFile(blob);
    }, 'image/jpeg', 0.9);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCapturedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const analyzeWithAI = async () => {
    if (!capturedFile) return;
    setIsProcessing(true);
    try {
      const result = await captureImageWithAI(capturedFile);
      setExtractedText(result.content);
      setNoteTitle(result.title);
      setNoteSubject(result.subject);
      setAiImageFilename(result.imageFilename ?? null);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'AI analysis failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveAsNote = () => {
    if (!extractedText.trim()) {
      addToast('No text to save', 'warning');
      return;
    }
    const tags = autoTag(noteTitle, extractedText);
    const images = aiImageFilename
      ? [apiUrl(`/uploads/${aiImageFilename}`)]
      : capturedImage
      ? [capturedImage]
      : [];
    const note = addNote({
      title: noteTitle || 'AI Captured Note',
      content: extractedText,
      subject: noteSubject || 'General',
      folder: 'default',
      tags,
      isPinned: false,
      isStarred: false,
      images,
      color: 'default',
    });
    addToast('Note created from AI capture! ✨');
    navigate(`/notes/${note.id}`);
  };

  const reset = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setExtractedText('');
    setNoteTitle('');
    setNoteSubject('');
    setAiImageFilename(null);
    stopCamera();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Capture" onMenuClick={onMenuClick} />

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Image capture area */}
        {!capturedImage ? (
          <div className="space-y-4">
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '4/3' }}>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button onClick={stopCamera} className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                    <X size={20} />
                  </button>
                  <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-400" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-elevated rounded-2xl p-8 text-center">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-border)' }}>
                  <Camera size={36} style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>AI Image Capture</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  Take a photo of handwritten notes, textbooks, or any document to extract text using Google Gemini AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={startCamera} icon={<Camera size={16} />} size="lg">
                    Open Camera
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="secondary" icon={<Upload size={16} />} size="lg">
                    Upload Image
                  </Button>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden">
              <img src={capturedImage} alt="Captured" className="w-full object-contain max-h-64 rounded-2xl" />
              <button onClick={reset} className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* AI Analysis area */}
            {!extractedText && !isProcessing && (
              <div className="card-elevated rounded-2xl p-6 text-center">
                <Zap size={32} className="mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Ready to Analyze</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  Click below to send the image to Google Gemini AI and extract text automatically.
                </p>
                <Button onClick={analyzeWithAI} icon={<Zap size={16} />} size="lg">
                  Analyze with AI
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="card-elevated rounded-2xl p-8">
                <LoadingSpinner size="lg" message="Analyzing with AI..." />
              </div>
            )}

            {extractedText && (
              <div className="space-y-4 animate-fade-in">
                {/* Title input */}
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Note Title</label>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Give this note a title..."
                    className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Subject input */}
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Subject</label>
                  <input
                    type="text"
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    placeholder="Subject or topic..."
                    className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                </div>

                {/* Extracted text */}
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Extracted Text</label>
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border outline-none text-sm resize-none"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)', minHeight: '200px' }}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveAsNote} icon={<Check size={16} />} size="lg" className="flex-1">
                    Save as Note
                  </Button>
                  <Button onClick={analyzeWithAI} variant="secondary" icon={<Zap size={16} />}>
                    Re-analyze
                  </Button>
                  <Button onClick={reset} variant="ghost" icon={<X size={16} />}>
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Tips */}
        <div className="card-flat rounded-2xl p-4">
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>📸 Tips for Best Results</h4>
          <ul className="text-xs space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
            <li>• Ensure good lighting — avoid shadows and glare</li>
            <li>• Hold the camera steady and keep text in focus</li>
            <li>• Use high contrast (dark text on light background)</li>
            <li>• Keep text horizontal for better accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}