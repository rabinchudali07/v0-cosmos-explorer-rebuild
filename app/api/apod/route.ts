import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestedDate = searchParams.get("date")
    let date: string

    if (requestedDate) {
      date = requestedDate
    } else {
      const now = new Date()
      // Get current date in YYYY-MM-DD format, subtract 1 day to ensure APOD is available
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate() - 1).padStart(2, "0")
      date = `${year}-${month}-${day}`
      console.log("[v0] Using date:", date)
    }

    const nasaApiKey = process.env.NASA_API_KEY
    if (!nasaApiKey) {
      return NextResponse.json({ error: "NASA API key not configured" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      console.log("[v0] Fetching APOD for date:", date)
      const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${nasaApiKey}`, {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.log("[v0] NASA API error:", response.status, response.statusText)

        if (!requestedDate) {
          console.log("[v0] Using hardcoded fallback APOD")
          const fallbackAPOD = {
            date: "2024-11-07",
            title: "LDN 1471: A Windblown Star Cavity",
            explanation:
              "What's happening in the Elephant's Trunk?  A dark interstellar cloud of gas and dust punctuated with newly formed stars is being eroded by the stellar winds and energetic light from nearby massive stars.  The featured image depicts the central part of the interstellar dust cloud IC 1396, cataloged as the emission nebula LDN 1471.  Located in the constellation of the King of Aethopia (Cepheus), the dust cloud forms the surface of the nebula's bright rim, where an embedded star cluster (Trumpler 37) is being revealed.  The bright rim is about 10 light-years across and the entire cavity is about 30 light-years across.  The energetic light from the central bright rim excites atoms in the cavity above it and is creating the red glow seen emanating from the Elephant's Trunk.  Located about 2,400 light-years away, the Elephant's Trunk nebula should not be confused with the somewhat more famous (but further away) Eagle Nebula.",
            url: "https://apod.nasa.gov/apod/image/2411/ElephantsTrunk_Mtanous_960.jpg",
            hdurl: "https://apod.nasa.gov/apod/image/2411/ElephantsTrunk_Mtanous_4232.jpg",
            media_type: "image",
            service_version: "v1",
          }
          return NextResponse.json(fallbackAPOD)
        }

        return NextResponse.json({ error: "Failed to fetch APOD data from NASA" }, { status: response.status })
      }

      const data = await response.json()
      console.log("[v0] APOD data fetched successfully")
      return NextResponse.json(data)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("[v0] NASA API timeout")
        const fallbackAPOD = {
          date: "2024-11-07",
          title: "LDN 1471: A Windblown Star Cavity",
          explanation:
            "What's happening in the Elephant's Trunk?  A dark interstellar cloud of gas and dust punctuated with newly formed stars is being eroded by the stellar winds and energetic light from nearby massive stars.  The featured image depicts the central part of the interstellar dust cloud IC 1396, cataloged as the emission nebula LDN 1471.  Located in the constellation of the King of Aethopia (Cepheus), the dust cloud forms the surface of the nebula's bright rim, where an embedded star cluster (Trumpler 37) is being revealed.  The bright rim is about 10 light-years across and the entire cavity is about 30 light-years across.  The energetic light from the central bright rim excites atoms in the cavity above it and is creating the red glow seen emanating from the Elephant's Trunk.  Located about 2,400 light-years away, the Elephant's Trunk nebula should not be confused with the somewhat more famous (but further away) Eagle Nebula.",
          url: "https://apod.nasa.gov/apod/image/2411/ElephantsTrunk_Mtanous_960.jpg",
          hdurl: "https://apod.nasa.gov/apod/image/2411/ElephantsTrunk_Mtanous_4232.jpg",
          media_type: "image",
          service_version: "v1",
        }
        return NextResponse.json(fallbackAPOD)
      }
      throw fetchError
    }
  } catch (error) {
    console.error("[v0] Error fetching APOD:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
