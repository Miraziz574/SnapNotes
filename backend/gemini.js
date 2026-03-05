import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function extractTextAndSubject(imageBase64, mimeType) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt =
      'Extract all handwritten text from this image. Also identify the subject or topic (e.g., Math, Science, History, English, etc.). Return a JSON object with fields: \'text\' (the extracted text) and \'subject\' (the identified subject/topic). If you cannot identify a subject, use \'General\'.'

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType
        }
      }
    ])

    const response = await result.response
    let raw = response.text().trim()

    // Strip markdown code block wrappers if present
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()

    const parsed = JSON.parse(raw)
    return {
      text: parsed.text || '',
      subject: parsed.subject || 'General'
    }
  } catch (err) {
    console.error('Gemini extraction error:', err)
    throw new Error('Failed to extract text from image: ' + err.message)
  }
}
