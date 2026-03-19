/**
 * Base URL for all backend API requests.
 *
 * In local development (`npm run dev`) this is intentionally empty so that
 * the Vite dev-server proxy transparently forwards `/api` and `/uploads`
 * requests to `http://localhost:3001`.
 *
 * For production builds (Capacitor / standalone PWA) set the environment
 * variable `VITE_API_URL` to the hosted backend origin, e.g.
 * `https://your-backend.example.com`.  Copy `frontend/.env.example` to
 * `frontend/.env.local` and fill in the value before building.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || '';

/**
 * Resolves a backend path against the configured API base URL.
 *
 * Examples:
 *   apiUrl('/api/notes')      → '/api/notes'           (local dev, proxy active)
 *   apiUrl('/uploads/a.jpg')  → '/uploads/a.jpg'       (local dev, proxy active)
 *   apiUrl('/api/notes')      → 'https://api.example.com/api/notes'  (production)
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
