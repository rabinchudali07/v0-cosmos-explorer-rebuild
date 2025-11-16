import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Rocket, Database, Telescope, Code } from "lucide-react"

export const metadata = {
  title: "About | CosmosExplorer",
  description: "Learn about CosmosExplorer and how we bring NASA data to you",
}

export default function AboutPage() {
  const features = [
    {
      icon: Telescope,
      title: "Astronomy Picture of the Day",
      description:
        "Explore NASA's daily selection of stunning space imagery dating back to 1995, complete with scientific explanations.",
    },
    {
      icon: Rocket,
      title: "Mars Rover Photos",
      description: "Browse incredible photos captured by NASA's rovers on Mars, including Curiosity and Perseverance.",
    },
    {
      icon: Database,
      title: "NEO Tracker",
      description: "Monitor near-Earth asteroids and track potentially hazardous objects in real-time.",
    },
    {
      icon: Code,
      title: "AstroBot AI Chat",
      description:
        "Chat with our AI-powered assistant to learn about space exploration and get insights from NASA data.",
    },
  ]

  const technologies = [
    {
      name: "Next.js",
      description: "Modern React framework for production",
    },
    {
      name: "NASA API",
      description: "Real-time space exploration data",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript development",
    },
  ]

  const developers = [
    {
      name: "Rabin Chudali",
      role: "Lead Developer",
      description:
        "Full-stack development, NASA API integration, Backend architecture, AI integration, and project management",
      image: "/developer-profile.png",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Nischal Darnal",
      role: "UI/UX Designer",
      description: "User interface design, user experience optimization, visual design, and interaction design",
      image: "/designer-profile.png",
      social: {
        github: "#",
        linkedin: "#",
      },
    },
  ]

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About CosmosExplorer</h1>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
              Bringing the wonders of space exploration to your fingertips through interactive exploration of NASA's
              vast collection of space data and imagery.
            </p>
          </div>

          {/* Mission Section */}
          <Card className="bg-card/50 border-border/50 p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              CosmosExplorer is dedicated to making space science accessible to everyone. We leverage NASA's
              comprehensive APIs to provide real-time access to some of the most fascinating data about our universe.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Whether you're a space enthusiast, student, or scientist, our platform provides intuitive tools to explore
              asteroids, view Mars rover imagery, discover daily space photographs, and chat with our AI-powered
              assistant about the cosmos.
            </p>
          </Card>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon
                return (
                  <Card key={idx} className="bg-card/50 border-border/50 p-6">
                    <div className="mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Development Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Development Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {developers.map((dev, idx) => (
                <Card key={idx} className="bg-card/50 border-border/50 p-8 hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 flex items-center justify-center text-5xl font-bold text-white shadow-lg shadow-cyan-500/20">
                      {dev.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                    <p className="text-primary font-semibold mb-3">{dev.role}</p>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed">{dev.description}</p>
                    <div className="flex gap-3">
                      {dev.social.github && (
                        <a href={dev.social.github} className="text-foreground/60 hover:text-primary transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {dev.social.linkedin && (
                        <a
                          href={dev.social.linkedin}
                          className="text-foreground/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {dev.social.twitter && (
                        <a
                          href={dev.social.twitter}
                          className="text-foreground/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technologies.map((tech, idx) => (
                <Card key={idx} className="bg-card/50 border-border/50 p-6">
                  <h3 className="font-semibold mb-2 text-primary">{tech.name}</h3>
                  <p className="text-sm text-foreground/70">{tech.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Getting Started Section */}
          <Card className="bg-card/50 border-border/50 p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-primary">1. Set Your NASA API Key</h3>
                <p className="text-foreground/70">
                  To use CosmosExplorer, you'll need a NASA API key. Get one for free at{" "}
                  <a
                    href="https://api.nasa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    api.nasa.gov
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">2. Add Environment Variable</h3>
                <p className="text-foreground/70">
                  Add your API key to the project's environment variables as{" "}
                  <code className="bg-muted px-2 py-1 rounded">NASA_API_KEY</code>
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">3. Explore the Cosmos</h3>
                <p className="text-foreground/70">
                  Navigate through our features to explore APOD, Mars rovers, track asteroids, and chat with AstroBot.
                </p>
              </div>
            </div>
          </Card>

          {/* Environment Variables Info */}
          <div className="mt-12 p-8 bg-muted/20 border border-border/50 rounded-lg">
            <h3 className="font-semibold mb-4">Environment Variables Required</h3>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-foreground/80">
                <span className="text-primary">NASA_API_KEY</span> - Your NASA API key from api.nasa.gov
              </p>
            </div>
            <p className="text-foreground/60 text-sm mt-4">
              Add this variable in your Vercel project settings under the "Environment Variables" section, or in your
              local .env.local file during development.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
