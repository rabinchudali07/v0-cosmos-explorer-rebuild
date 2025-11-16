"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    class Star {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      twinkleSpeed: number
      layer: number // For parallax depth

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2.5 + 0.5
        this.layer = Math.floor(Math.random() * 3) // 0, 1, or 2 for depth layers
        this.speed = (Math.random() * 0.1 + 0.05) * (this.layer + 1) // Faster for closer layers
        this.opacity = Math.random() * 0.6 + 0.3
        this.twinkleSpeed = Math.random() * 0.02 + 0.005
      }

      update() {
        this.x -= this.speed
        if (this.x < -10) {
          this.x = canvas.width + 10
          this.y = Math.random() * canvas.height
        }

        // Twinkling effect
        this.opacity += this.twinkleSpeed
        if (this.opacity > 1 || this.opacity < 0.3) {
          this.twinkleSpeed = -this.twinkleSpeed
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow for larger stars
        if (this.size > 1.8) {
          ctx.shadowBlur = 8
          ctx.shadowColor = this.layer === 0 ? "rgba(150, 200, 255, 0.8)" : "rgba(200, 220, 255, 0.6)"
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }
    }

    class Meteor {
      x: number
      y: number
      length: number
      speed: number
      opacity: number
      angle: number

      constructor() {
        this.x = Math.random() * canvas.width + canvas.width * 0.2
        this.y = -50 - Math.random() * 100
        this.length = Math.random() * 120 + 60
        this.speed = Math.random() * 4 + 3
        this.opacity = 1
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3 // Slight angle variation
      }

      update() {
        this.x -= Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.opacity -= 0.008
      }

      draw() {
        if (!ctx) return
        const gradient = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x + Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length,
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`)
        gradient.addColorStop(0.3, `rgba(150, 220, 255, ${this.opacity * 0.8})`)
        gradient.addColorStop(1, `rgba(100, 150, 255, 0)`)

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(150, 220, 255, ${this.opacity * 0.5})`
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length)
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      isOffScreen() {
        return this.y > canvas.height + 100 || this.x < -100 || this.opacity <= 0
      }
    }

    // Create stars with multiple layers
    const stars: Star[] = []
    for (let i = 0; i < 300; i++) {
      stars.push(new Star())
    }

    // Meteors array
    const meteors: Meteor[] = []

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.fillStyle = "rgba(5, 5, 16, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars (background to foreground layers)
      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      if (Math.random() < 0.015) {
        meteors.push(new Meteor())
      }

      // Update and draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update()
        meteors[i].draw()

        if (meteors[i].isOffScreen()) {
          meteors.splice(i, 1)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "linear-gradient(to bottom, #050510, #0a0a1e, #0f0a20)" }}
    />
  )
}
