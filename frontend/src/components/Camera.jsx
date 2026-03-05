import React, { useRef, useState, useEffect } from 'react'

export default function Camera({ onNoteAdded }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [capturedBlob, setCapturedBlob] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [successNote, setSuccessNote] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [cameraReady, setCameraReady] = useState(false)

  useEffect(() => {
    startCamera()
    return () => stopStream()
  }, [facingMode])

  async function startCamera() {
    stopStream()
    setCameraReady(false)
    setError('')
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.onloadedmetadata = () => setCameraReady(true)
      }
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings and reload the page.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else {
        setError('Could not start camera: ' + err.message)
      }
    }
  }

  function stopStream() {
    setStream(prev => {
      if (prev) prev.getTracks().forEach(t => t.stop())
      return null
    })
    setCameraReady(false)
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      setCapturedBlob(blob)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      setCapturedImage(dataUrl)
      stopStream()
    }, 'image/jpeg', 0.9)
  }

  async function processNote() {
    if (!capturedBlob) return
    setIsProcessing(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('photo', capturedBlob, 'capture.jpg')
      const res = await fetch('/api/notes/capture', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Server error')
      }
      const note = await res.json()
      setSuccessNote(note)
      onNoteAdded(note)
    } catch (err) {
      setError('Failed to process note: ' + err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  function resetCapture() {
    setCapturedImage(null)
    setCapturedBlob(null)
    setSuccessNote(null)
    setError('')
    startCamera()
  }

  function flipCamera() {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
    setCapturedImage(null)
    setCapturedBlob(null)
  }

  if (successNote) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">✅</div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Note Captured!</h2>
              <p className="text-sm text-gray-500">Your note has been saved successfully.</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
              {successNote.subject}
            </span>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{successNote.text}</p>
          </div>
          <button
            onClick={resetCapture}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            📷 Capture Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">📷 Capture a Note</h2>
          <p className="text-sm text-gray-500 mt-0.5">Point your camera at handwritten notes</p>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="relative bg-black aspect-video">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!cameraReady && !error && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-4xl mb-2 animate-pulse">📷</div>
                    <p className="text-sm opacity-75">Starting camera...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 flex flex-col gap-3">
          {!capturedImage ? (
            <div className="flex gap-3">
              <button
                onClick={flipCamera}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                title="Flip camera"
              >
                🔄
              </button>
              <button
                onClick={capturePhoto}
                disabled={!cameraReady}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                📸 Capture
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={resetCapture}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                ↩️ Retake
              </button>
              <button
                onClick={processNote}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-75 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing with AI...
                  </>
                ) : (
                  '✨ Process Note'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-3">
        Camera access is required. Your images are processed securely.
      </p>
    </div>
  )
}
