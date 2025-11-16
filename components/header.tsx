"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/astrobot", label: "AstroBot" },
    { href: "/apod", label: "APOD" },
    { href: "/mars-rover", label: "Mars Rover" },
    { href: "/neo-tracker", label: "NEO Tracker" },
    { href: "/about", label: "About" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            ✦
          </div>
          <span>CosmosExplorer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-card rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-card rounded-md transition-colors">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 border-b border-border/50 bg-background/95 backdrop-blur-sm md:hidden">
            <div className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-card/50 border-b border-border/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
