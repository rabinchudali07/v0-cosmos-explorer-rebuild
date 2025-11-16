import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json()

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const targetLanguage = language === "nepali" ? "Nepali (नेपाली)" : "Hindi (हिन्दी)"

    const prompt = `Translate the following English text to ${targetLanguage}. Provide ONLY the translated text without any explanations, notes, or additional context:

${text}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2000,
            topP: 0.95,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error("Translation request failed")
    }

    const data = await response.json()
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
