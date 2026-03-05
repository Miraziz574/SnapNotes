import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromImage } from '@/lib/gemini';
import { createNote } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface CaptureRequestBody {
  image: string;
  mimeType?: string;
  save?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CaptureRequestBody;
    const { image, mimeType = 'image/jpeg', save = true } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'image field is required (base64)' },
        { status: 400 }
      );
    }

    // Strip data URI prefix if present
    const base64Data = image.replace(/^data:[^;]+;base64,/, '');

    const extraction = await extractTextFromImage(base64Data, mimeType);

    let note = null;
    if (save && extraction.text) {
      note = createNote(extraction.text, extraction.subject, base64Data);
    }

    return NextResponse.json({
      text: extraction.text,
      subject: extraction.subject,
      note,
    });
  } catch (error) {
    console.error('POST /api/capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
