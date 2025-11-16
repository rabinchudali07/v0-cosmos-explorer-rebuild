import Link from "next/link"
import { Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    Explore: [
      { label: "Astronomy Pictures", href: "/apod" },
      { label: "Mars Rover Photos", href: "/mars-rover" },
      { label: "NEO Tracker", href: "/neo-tracker" },
      { label: "AstroBot Chat", href: "/astrobot" },
    ],
    Resources: [
      { label: "About Us", href: "/about" },
      { label: "NASA APIs", href: "https://api.nasa.gov", external: true },
      { label: "Source Code", href: "#", external: true },
    ],
    Connect: [
      { icon: Github, label: "GitHub" },
      { icon: Twitter, label: "Twitter" },
      { icon: Mail, label: "Email" },
    ],
  }

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                ✦
              </div>
              <span>CosmosExplorer</span>
            </Link>
            <p className="text-foreground/60 text-sm">
              Your gateway to the cosmos. Explore space through NASA&apos;s eyes with our AI-powered companion.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2">
              {links.Explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/60 hover:text-foreground text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-2">
              {links.Resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-foreground/60 hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-3">
              {links.Connect.map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.label}
                    className="w-10 h-10 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center transition-all group"
                  >
                    <Icon size={18} className="text-foreground/60 group-hover:text-primary" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
            <p>© {currentYear} CosmosExplorer. Powered by NASA APIs. Made with ❤️ for space enthusiasts.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
