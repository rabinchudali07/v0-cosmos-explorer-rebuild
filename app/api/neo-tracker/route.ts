import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const nasaApiKey = process.env.NASA_API_KEY
    if (!nasaApiKey) {
      return NextResponse.json({ error: "NASA API key not configured" }, { status: 400 })
    }

    // Fetch recent close approach data
    const today = new Date()
    const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const endDate = today.toISOString().split("T")[0]

    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${nasaApiKey}`,
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch NEO data from NASA" }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json({
      near_earth_objects: data.near_earth_objects,
      page: {
        total_elements: data.element_count || 0,
      },
    })
  } catch (error) {
    console.error("Error fetching NEO data:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
