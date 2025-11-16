import AnimatedBackground from "@/components/animated-background"
import Header from "@/components/header"
import HeroInteractive from "@/components/hero-interactive"
import ExplorationPanel from "@/components/exploration-panel"
import FloatingAPOD from "@/components/floating-apod"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header />
        <HeroInteractive />
        <ExplorationPanel />
        <FloatingAPOD />
        <Footer />
      </div>
    </main>
  )
}
