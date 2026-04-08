import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini directly on the frontend
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface CaptureResult {
  title: string;
  content: string;
  subject: string;
  imageFilename?: string;
}

export async function captureImageWithAI(file: File | Blob): Promise<CaptureResult> {
  try {
    // 1. Convert the uploaded file/photo to Base64
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // 2. Send to Gemini 1.5 Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Extract all handwritten text from this image. Return a JSON object with fields: "text" (the extracted text), "title" (a short 3-4 word title based on the content), and "subject" (the identified subject/topic, default to General).';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'image/jpeg'
        }
      }
    ]);

    // 3. Parse the JSON response
    let rawText = result.response.text().trim();
    // Strip markdown formatting if Gemini includes it
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const parsed = JSON.parse(rawText);
    
    return {
      content: parsed.text || '',
      title: parsed.title || 'New Scanned Note',
      subject: parsed.subject || 'General'
    };
  } catch (error) {
    console.error('Error processing image with Gemini:', error);
    throw new Error('Failed to extract text from the image. Please try again.');
  }
}