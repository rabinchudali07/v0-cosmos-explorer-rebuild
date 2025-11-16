import Link from "next/link"
import { Telescope, ImageIcon, Radar } from "lucide-react"

const features = [
  {
    icon: Telescope,
    title: "APOD Explorer",
    description:
      "Discover breathtaking astronomy pictures of the day, complete with detailed explanations from NASA's cosmic gallery.",
    href: "/apod",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ImageIcon,
    title: "Mars Rover Photos",
    description:
      "Explore the Red Planet (mars) through the eyes of NASA's rovers. Browse thousands of high-resolution images from Mars.",
    href: "/mars-rover",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Radar,
    title: "NEO Tracker",
    description:
      "Monitor Near-Earth Objects and track asteroids approaching our planet with real-time NASA data and alerts.",
    href: "/neo-tracker",
    color: "from-pink-500 to-red-500",
  },
]

export default function Features() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative rounded-xl border border-border/50 bg-card/30 backdrop-blur p-6 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
