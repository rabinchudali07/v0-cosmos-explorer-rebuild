"use client"

import { Rocket, Telescope, Bot, Satellite } from "lucide-react"
import Link from "next/link"

export default function ExplorationPanel() {
  const tools = [
    {
      icon: Bot,
      title: "AstroBot Assistant",
      description: "Ask me anything about space, astronomy, and the cosmos. I'm here to guide your stellar journey.",
      href: "/astrobot",
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: Telescope,
      title: "Picture of the Day",
      description: "Experience breathtaking astronomy images curated daily by NASA with detailed explanations.",
      href: "/apod",
      gradient: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      icon: Rocket,
      title: "Mars Exploration",
      description: "View the latest high-resolution photos captured by NASA's Mars rovers exploring the red planet.",
      href: "/mars-rover",
      gradient: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
    },
    {
      icon: Satellite,
      title: "NEO Tracker",
      description: "Monitor near-Earth objects and asteroids. Stay informed about celestial bodies passing by Earth.",
      href: "/neo-tracker",
      gradient: "from-chart-4/20 to-chart-4/5",
      iconColor: "text-chart-4",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Explore the Universe</h2>
          <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto leading-relaxed">
            Choose your cosmic adventure. Each tool offers a unique window into the wonders of space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <Link
                key={index}
                href={tool.href}
                className="group relative overflow-hidden p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-card/50 card-hover"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-background/50 border border-border/50 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="text-foreground/60 leading-relaxed">{tool.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
