import Header from "@/components/header"
import Footer from "@/components/footer"
import MarsRoverGallery from "@/components/mars-rover-gallery"

export const metadata = {
  title: "Mars Rover Photos | CosmosExplorer",
  description: "Explore stunning photos captured by NASA's Mars rovers: Curiosity and Perseverance",
}

export default function MarsRoverPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <MarsRoverGallery />
      </div>
      <Footer />
    </main>
  )
}
