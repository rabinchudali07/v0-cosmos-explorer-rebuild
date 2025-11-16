import Header from "@/components/header"
import Footer from "@/components/footer"
import APODExplorer from "@/components/apod-explorer"

export const metadata = {
  title: "APOD Explorer | CosmosExplorer",
  description: "Explore NASA's Astronomy Picture of the Day archive and discover stunning space imagery",
}

export default function APODPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <APODExplorer />
      </div>
      <Footer />
    </main>
  )
}
