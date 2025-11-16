"use client"

import Link from "next/link"
import { Rocket } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto text-center relative z-10 max-w-4xl">
        <div className="inline-block mb-6 px-4 py-2 rounded-full border border-primary/50 bg-primary/5 backdrop-blur">
          <span className="text-sm font-medium text-primary">✦ Runs on real time data</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-pretty">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Explore the
          </span>
          <br />
          <span className="text-white">Cosmos</span>
          <span className="text-3xl md:text-4xl animate-bounce inline-block ml-2">✧</span>
        </h1>

        <p className="text-lg text-foreground/70 mb-8 text-pretty max-w-2xl mx-auto">
          Journey through space with our AI-powered companion. Discover Mars rover photos, track asteroids, and explore
          the daily wonders of our universe through NASA&apos;s vast data archives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/astrobot"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-background font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
          >
            <Rocket size={20} />
            Launch AstroBot
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-full border border-primary/50 text-foreground hover:bg-primary/10 font-semibold transition-all"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}
