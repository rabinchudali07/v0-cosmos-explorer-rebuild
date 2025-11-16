import Header from "@/components/header"
import Footer from "@/components/footer"
import NEOTracker from "@/components/neo-tracker"

export const metadata = {
  title: "NEO Tracker | CosmosExplorer",
  description: "Track near-Earth asteroids and monitor potentially hazardous objects",
}

export default function NEOTrackerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <NEOTracker />
      </div>
      <Footer />
    </main>
  )
}
