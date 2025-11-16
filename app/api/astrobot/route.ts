import { type NextRequest, NextResponse } from "next/server"
import { Buffer } from "buffer"

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let message = ""
    let conversationHistory: ConversationMessage[] = []
    let imageBase64: string | null = null

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      message = (formData.get("message") as string) || ""
      const historyStr = formData.get("conversationHistory") as string
      conversationHistory = historyStr ? JSON.parse(historyStr) : []

      const imageFile = formData.get("image") as File
      if (imageFile) {
        const buffer = await imageFile.arrayBuffer()
        imageBase64 = Buffer.from(buffer).toString("base64")
      }
    } else {
      const body = await request.json()
      message = body.message
      conversationHistory = body.conversationHistory || []
    }

    const nasaApiKey = process.env.NASA_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY

    if (imageBase64 && geminiApiKey) {
      const geminiResponse = await handleGeminiVision(message, imageBase64, geminiApiKey)
      return NextResponse.json({ response: geminiResponse, apiSource: "gemini" })
    }

    const casualKeywords = ["hello", "hi", "hey", "thanks", "thank you", "bye", "joke", "how are you"]
    const isCasualQuery = casualKeywords.some((keyword) => message.toLowerCase().includes(keyword))

    let response = ""
    let apiSource: "nasa" | "gemini" = "gemini"

    if (isCasualQuery && geminiApiKey) {
      const geminiResponse = await handleGeminiQuery(message, conversationHistory, geminiApiKey)
      return NextResponse.json({ response: geminiResponse, apiSource: "gemini" })
    }

    try {
      if (nasaApiKey) {
        if (
          message.toLowerCase().includes("asteroid") ||
          message.toLowerCase().includes("neo") ||
          message.toLowerCase().includes("near-earth")
        ) {
          response = await handleAsteroidQuery(message, nasaApiKey)
          apiSource = "nasa"
        } else if (message.toLowerCase().includes("mars") || message.toLowerCase().includes("rover")) {
          response = await handleMarsRoverQuery(message, nasaApiKey)
          apiSource = "nasa"
        } else if (
          message.toLowerCase().includes("astronomy") ||
          message.toLowerCase().includes("apod") ||
          message.toLowerCase().includes("picture")
        ) {
          response = await handleAPODQuery(message, nasaApiKey)
          apiSource = "nasa"
        }
      }
    } catch (error) {
      console.error("[v0] NASA API timeout or error:", error)
      if (geminiApiKey) {
        response = await handleGeminiQuery(message, conversationHistory, geminiApiKey)
        apiSource = "gemini"
      }
    }

    if (!response) {
      if (geminiApiKey) {
        response = await handleGeminiQuery(message, conversationHistory, geminiApiKey)
        apiSource = "gemini"
      } else {
        response = await handleGeneralQuery(message, conversationHistory)
        apiSource = "gemini"
      }
    }

    return NextResponse.json({ response, apiSource })
  } catch (error) {
    console.error("Error in AstroBot API:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

async function handleGeminiQuery(
  message: string,
  conversationHistory: ConversationMessage[],
  geminiApiKey: string,
): Promise<string> {
  try {
    const systemPrompt = `You are AstroBot, an enthusiastic and knowledgeable space exploration assistant powered by NASA and Gemini AI. You make complex space topics accessible and exciting.

Guidelines:
- Keep responses conversational and engaging (2-3 sentences for simple questions, 4-6 for explanations)
- Use friendly, encouraging language with a sense of wonder about space
- When translating NASA data, simplify technical jargon into clear, relatable language
- Use analogies to help explain complex concepts (e.g., "A neutron star is so dense that a teaspoon would weigh as much as Mount Everest!")
- Include fascinating facts when relevant
- For greetings (hi, hello, hey), respond warmly and invite exploration
- When discussing NASA missions or data, express enthusiasm about discoveries
- If the user seems curious, encourage deeper exploration with follow-up suggestions

Current question: ${message}`

    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 800,
            topP: 0.95,
            topK: 40,
          },
        }),
      },
      8000,
    )

    if (!response.ok) {
      throw new Error("Gemini API request failed")
    }

    const data = await response.json()
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help you explore the cosmos! What would you like to know about space?"
    )
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return "Hello, space explorer! I'm AstroBot, ready to guide you through the wonders of the cosmos. I can show you stunning space imagery, track asteroids, explore Mars through rover eyes, and chat about anything from black holes to distant galaxies. What cosmic mystery shall we unravel together?"
    }
    return "I'm AstroBot, your cosmic companion! I blend NASA's real-time data with AI to help you explore space phenomena, view breathtaking astronomy images, track near-Earth objects, and learn about our universe. What sparks your curiosity?"
  }
}

async function handleAsteroidQuery(message: string, nasaApiKey: string): Promise<string> {
  try {
    const response = await fetchWithTimeout(
      `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${nasaApiKey}`,
      {},
      5000,
    )

    if (!response.ok) {
      throw new Error("NASA API failed")
    }

    const data = await response.json()
    const neoCount = data.page?.total_elements || "thousands"
    const nearEarthObjects = data.near_earth_objects?.slice(0, 3) || []

    let response_text = `NASA actively tracks ${neoCount} near-Earth asteroids! These cosmic rocks orbit close enough to Earth that we monitor them carefully. `

    if (nearEarthObjects.length > 0) {
      const hazardous = nearEarthObjects.filter((neo: any) => neo.is_potentially_hazardous_asteroid).length
      response_text += `Of the recent discoveries, ${hazardous} are classified as potentially hazardous, meaning they're large enough and pass close enough that we keep a watchful eye on them. `
    }

    response_text += `The good news? We're constantly improving our detection capabilities, and no known asteroid poses a threat to Earth in the foreseeable future. The most famous near-Earth asteroid, Apophis, will make an incredibly close pass in 2029—close enough to see with the naked eye! Would you like to know more about specific asteroids or how we track them?`

    return response_text
  } catch (error) {
    console.error("Error fetching asteroid data:", error)
    throw error
  }
}

async function handleMarsRoverQuery(message: string, nasaApiKey: string): Promise<string> {
  try {
    const response = await fetchWithTimeout(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${nasaApiKey}`,
      {},
      5000,
    )

    if (!response.ok) {
      throw new Error("NASA API failed")
    }

    const data = await response.json()
    const latestPhotos = data.latest_photos || []
    const photoCount = latestPhotos.length

    let response_text = `Curiosity rover is still going strong on Mars after landing in 2012! `

    if (photoCount > 0) {
      const sol = latestPhotos[0]?.sol || "recent"
      response_text += `It just sent back ${photoCount} stunning new photos from Sol ${sol} (that's Martian day ${sol} of its mission). These images help scientists study Martian geology, search for signs of ancient water, and understand if Mars could have supported microbial life. `
    }

    response_text += `Along with its companion Perseverance, these rovers are our eyes on the Red Planet, exploring ancient riverbeds and drilling into rocks that are billions of years old. Would you like to see some of these latest images or learn about specific Mars discoveries?`

    return response_text
  } catch (error) {
    console.error("Error fetching rover data:", error)
    throw error
  }
}

async function handleAPODQuery(message: string, nasaApiKey: string): Promise<string> {
  try {
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const dateStr = yesterday.toISOString().split("T")[0]

    const response = await fetchWithTimeout(
      `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${dateStr}`,
      {},
      5000,
    )

    if (!response.ok) {
      throw new Error("NASA API failed")
    }

    const data = await response.json()

    let response_text = `Today's Astronomy Picture of the Day features "${data.title}"! `

    if (data.explanation) {
      const shortExplanation = data.explanation.substring(0, 250)
      response_text += `${shortExplanation}... `
    }

    response_text += `\n\nNASA has been sharing breathtaking space imagery through APOD since 1995—that's over 9,000 stunning cosmic views! Each image comes with an explanation written by professional astronomers. Want to explore more amazing space images from the archive?`

    return response_text
  } catch (error) {
    console.error("Error fetching APOD data:", error)
    throw error
  }
}

async function handleGeneralQuery(message: string, conversationHistory: ConversationMessage[]): Promise<string> {
  const generalResponses: Record<string, string> = {
    hello:
      "Hello! I'm AstroBot. I can help you explore NASA's space data and answer questions about the cosmos. What would you like to learn about?",
    space:
      "Space is the vast expanse beyond Earth's atmosphere. It contains countless stars, galaxies, planets, and other celestial objects. NASA continuously explores space to understand the universe better.",
    universe:
      "The universe is everything - all galaxies, stars, planets, and space itself. Scientists estimate it's about 13.8 billion years old. NASA studies the universe using telescopes and space missions.",
    earth:
      "Earth is our home planet, located in the habitable zone of our solar system. NASA monitors Earth's climate, weather, and changes to help us understand our planet better.",
  }

  const lowerMessage = message.toLowerCase()

  for (const [key, value] of Object.entries(generalResponses)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }

  return `That's an interesting question about space! I specialize in information from NASA's databases about asteroids, Mars rovers, astronomy imagery, and space exploration. I can help you explore near-Earth objects, view latest rover photos, learn about the Astronomy Picture of the Day, or discuss general space topics. What specifically would you like to know more about?`
}

async function handleGeminiVision(message: string, imageBase64: string, geminiApiKey: string): Promise<string> {
  try {
    const prompt =
      message ||
      "What do you see in this image? Please describe it in detail, especially if it's related to space, astronomy, or science."

    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      },
      10000,
    )

    if (!response.ok) {
      throw new Error("Gemini Vision API request failed")
    }

    const data = await response.json()
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I analyzed your image, but couldn't generate a description. Could you tell me more about what you'd like to know?"
    )
  } catch (error) {
    console.error("[v0] Gemini Vision API error:", error)
    return "I'm having trouble analyzing the image right now. Could you describe what you'd like to know about it?"
  }
}
