"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react"
import Image from "next/image"

interface APODData {
  date: string
  title: string
  explanation: string
  url: string
  media_type: string
  copyright?: string
  hdurl?: string
}

export default function APODExplorer() {
  const [date, setDate] = useState("")
  const [apodData, setApodData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize with today's date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setDate(today)
  }, [])

  // Fetch APOD data when date changes
  useEffect(() => {
    if (!date) return

    const fetchAPOD = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/apod?date=${date}`)
        if (!response.ok) {
          throw new Error("Failed to fetch APOD data")
        }
        const data = await response.json()
        setApodData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load APOD data")
        setApodData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAPOD()
  }, [date])

  const handlePreviousDay = () => {
    const currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() - 1)
    const newDate = currentDate.toISOString().split("T")[0]
    // Don't go before June 16, 1995 (APOD start date)
    if (newDate >= "1995-06-16") {
      setDate(newDate)
    }
  }

  const handleNextDay = () => {
    const currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() + 1)
    const today = new Date().toISOString().split("T")[0]
    if (currentDate.toISOString().split("T")[0] <= today) {
      setDate(currentDate.toISOString().split("T")[0])
    }
  }

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Astronomy Picture of the Day</h1>
        <p className="text-foreground/70">
          Explore NASA's daily space imagery and discover the wonders of the universe
        </p>
      </div>

      {/* Date Navigation */}
      <Card className="bg-card/50 border-border/50 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Button onClick={handlePreviousDay} variant="outline" size="icon" className="border-border/50 bg-transparent">
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <Calendar className="w-4 h-4 text-foreground/60" />
            <Input
              type="date"
              value={date}
              onChange={handleDateInput}
              min="1995-06-16"
              max={new Date().toISOString().split("T")[0]}
              className="bg-input border-border/50"
            />
          </div>

          <Button
            onClick={handleNextDay}
            variant="outline"
            size="icon"
            className="border-border/50 bg-transparent"
            disabled={date === new Date().toISOString().split("T")[0]}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-destructive/10 border-destructive/50 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <p className="text-foreground/70 mt-2 text-sm">Please make sure your NASA API key is configured</p>
        </Card>
      )}

      {/* APOD Content */}
      {apodData && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Container */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50 overflow-hidden aspect-video relative">
              {apodData.media_type === "image" ? (
                <Image
                  src={apodData.url || "/placeholder.svg"}
                  alt={apodData.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : apodData.media_type === "video" ? (
                <iframe src={apodData.url} title={apodData.title} className="w-full h-full" allowFullScreen />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Media type not supported</p>
                </div>
              )}
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50 p-6">
              <h2 className="text-2xl font-bold mb-2 line-clamp-3">{apodData.title}</h2>
              <p className="text-sm text-foreground/60 mb-4">
                {new Date(apodData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {apodData.copyright && (
                <p className="text-xs text-foreground/50 border-t border-border/30 pt-3">© {apodData.copyright}</p>
              )}
            </Card>

            {apodData.hdurl && (
              <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary hover:bg-primary/90">View High Resolution</Button>
              </a>
            )}

            <Card className="bg-card/50 border-border/50 p-6">
              <h3 className="font-semibold mb-3">About Today's Image</h3>
              <p className="text-sm leading-relaxed text-foreground/80">{apodData.explanation}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
