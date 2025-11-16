import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { audio } = await request.json()

    if (!audio) {
      return NextResponse.json({ error: "No audio data provided" }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Use Web Speech API fallback or Gemini for transcription
    // For now, return a mock response since speech-to-text requires specific API
    // In production, you'd integrate with Google Speech-to-Text or similar service

    return NextResponse.json({
      text: "Speech transcription is being processed...",
    })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
