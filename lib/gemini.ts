import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY ?? '';

const PROMPT = `Extract all text from this image. Also suggest a subject/category for this note (like Math, Physics, Chemistry, History, English, Biology, Computer Science, General, etc.). Return ONLY valid JSON in this exact format: {"text": "extracted text here", "subject": "suggested subject here"}`;

export interface ExtractionResult {
  text: string;
  subject: string;
}

export async function extractTextFromImage(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<ExtractionResult> {
  if (!API_KEY) {
    return {
      text: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.',
      subject: 'General',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      PROMPT,
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    const rawText = response.text().trim();

    // Strip markdown code fences if present
    const jsonText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(jsonText) as { text?: string; subject?: string };

    return {
      text: parsed.text ?? rawText,
      subject: parsed.subject ?? 'General',
    };
  } catch (error) {
    console.error('Gemini extraction error:', error);
    return {
      text: 'Failed to extract text from image. Please try again.',
      subject: 'General',
    };
  }
}
