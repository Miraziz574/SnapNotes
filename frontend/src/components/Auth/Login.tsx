import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../utils/firebase';
import { Button } from '../UI/Button';

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const friendlyMessages: Record<string, string> = {
        'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
        'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
        'auth/network-request-failed': 'Network error. Please check your connection and try again.',
        'auth/cancelled-popup-request': 'Another sign-in is already in progress.',
        'auth/unauthorized-domain': 'This domain is not authorized for sign-in. Contact the app administrator.',
      };
      setError(
        (code && friendlyMessages[code]) ??
        (err instanceof Error ? err.message : 'Sign-in failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div
        className="rounded-3xl p-10 max-w-sm w-full mx-4 shadow-2xl text-center"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          SnapNotes
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Sign in to access your notes from anywhere.
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-4 rounded-xl p-3" style={{ backgroundColor: 'var(--color-bg)' }}>
            {error}
          </p>
        )}

        <Button
          onClick={handleGoogleSignIn}
          loading={loading}
          size="lg"
          className="w-full"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
