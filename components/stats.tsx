const stats = [
  { value: "1000+", label: "Mars Photos Daily" },
  { value: "24/7", label: "NEO Monitoring" },
  { value: "365", label: "APOD Images/Year" },
  { value: "∞", label: "Cosmic Wonder" },
]

export default function Stats() {
  return (
    <section className="py-16 px-4 border-y border-border/50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
