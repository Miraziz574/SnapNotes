import { apiUrl } from './api';

export interface CaptureResult {
  title: string;
  content: string;
  subject: string;
  imageFilename?: string;
}

/**
 * Sends an image file or blob to the backend `/api/notes/capture` endpoint,
 * which uses Google Gemini AI to extract text and identify the subject.
 *
 * Returns structured note data ready to be added to the Zustand store.
 */
export async function captureImageWithAI(image: File | Blob): Promise<CaptureResult> {
  const formData = new FormData();
  const filename =
    image instanceof File && image.name
      ? image.name
      : `capture.${image.type.split('/')[1] || 'jpg'}`;
  formData.append('photo', image, filename);

  const response = await fetch(apiUrl('/api/notes/capture'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error || `Server error: ${response.status}`);
  }

  const data = await response.json() as {
    id: number;
    text: string;
    subject: string;
    timestamp: string;
    image_filename: string | null;
  };

  const text: string = data.text || '';
  const subject: string = data.subject || 'General';

  // Derive title from the first meaningful line of extracted text (max 60 chars),
  // falling back to "<Subject> Notes".
  const firstLine = text.split('\n').find((l) => l.trim().length > 0)?.trim() ?? '';
  const title =
    firstLine.length > 0 && firstLine.length <= 60
      ? firstLine
      : `${subject} Notes`;

  return {
    title,
    content: text,
    subject,
    imageFilename: data.image_filename ?? undefined,
  };
}
