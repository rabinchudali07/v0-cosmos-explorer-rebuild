"use client"

import { useState } from "react"
import { Sparkles, Telescope, Rocket, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroInteractive() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Telescope,
      title: "Explore",
      description: "Discover stunning astronomy pictures daily",
      href: "/apod",
      color: "text-primary",
    },
    {
      icon: Rocket,
      title: "Mars Rover",
      description: "View latest photos from Mars surface",
      href: "/mars-rover",
      color: "text-secondary",
    },
    {
      icon: Globe,
      title: "NEO Tracker",
      description: "Track near-Earth objects in real-time",
      href: "/neo-tracker",
      color: "text-accent",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Hero Content */}
        <div className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Powered by NASA APIs</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Your Gateway to the{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Cosmos
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 text-balance max-w-3xl mx-auto leading-relaxed">
            Explore the universe through NASA&apos;s eyes. Chat with AstroBot, discover breathtaking space imagery, and
            track celestial objects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button asChild size="lg" className="text-lg px-8 py-6 glow-primary">
              <Link href="/astrobot">
                <Sparkles className="w-5 h-5 mr-2" />
                Chat with AstroBot
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/apod">Explore Space</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                href={feature.href}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-card/50 card-hover"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-lg bg-background/50 transition-all duration-300 ${
                      hoveredFeature === index ? "scale-110" : ""
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
