"use client"

import { useEffect, useState } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface APODData {
  title: string
  url: string
  media_type: string
  explanation: string
  error?: string
}

export default function FloatingAPOD() {
  const [apod, setApod] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/apod`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch APOD")
        }
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          console.error("[v0] APOD API error:", data.error)
          setError(true)
        } else {
          setApod(data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error fetching APOD:", error)
        setError(true)
        setLoading(false)
      })
  }, [])

  if (loading || error || !apod || apod.media_type !== "image") {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/30 backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src={apod.url || "/placeholder.svg"}
                alt={apod.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent lg:bg-gradient-to-r" />
            </div>

            {/* Content Side */}
            <div className="relative p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium w-fit mb-4">
                <Sparkles className="w-3 h-3" />
                <span>Today&apos;s Featured Image</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance leading-tight">{apod.title}</h2>

              <p className="text-foreground/70 leading-relaxed mb-6 line-clamp-4">{apod.explanation}</p>

              <Button asChild className="w-fit group">
                <Link href="/apod">
                  View Full Gallery
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
