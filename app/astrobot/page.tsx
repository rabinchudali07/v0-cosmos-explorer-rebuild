import ChatInterface from "@/components/chat-interface"

export const metadata = {
  title: "AstroBot Chat | CosmosExplorer",
  description: "Chat with AstroBot about NASA missions, space exploration, and celestial objects",
}

export default function AstroBotPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <ChatInterface />
    </main>
  )
}
