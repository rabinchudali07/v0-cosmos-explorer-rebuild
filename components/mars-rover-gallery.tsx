"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Calendar } from "lucide-react"
import Image from "next/image"

interface Photo {
  id: number
  img_src: string
  earth_date: string
  rover: {
    name: string
  }
  camera: {
    full_name: string
  }
}

interface RoverData {
  photos: Photo[]
  total_photos: number
}

const ROVERS = [
  { name: "Curiosity", value: "curiosity", active: true },
  { name: "Perseverance", value: "perseverance", active: true },
  { name: "Opportunity", value: "opportunity", active: false },
  { name: "Spirit", value: "spirit", active: false },
]

const CAMERAS: Record<string, { name: string; full_name: string }[]> = {
  curiosity: [
    { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { name: "MAST", full_name: "Mast Camera" },
    { name: "CHEMCAM", full_name: "Chemistry and Camera" },
    { name: "RAD", full_name: "Radiation Assessment Detector" },
  ],
  perseverance: [
    { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { name: "MAST", full_name: "Mast Camera" },
    { name: "NAVCAM", full_name: "Navigation Camera" },
    { name: "MCZ_RIGHT", full_name: "Microphones (Right)" },
  ],
  opportunity: [
    { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { name: "NAVCAM", full_name: "Navigation Camera" },
    { name: "PANCAM", full_name: "Panoramic Camera" },
  ],
  spirit: [
    { name: "FHAZ", full_name: "Front Hazard Avoidance Camera" },
    { name: "RHAZ", full_name: "Rear Hazard Avoidance Camera" },
    { name: "NAVCAM", full_name: "Navigation Camera" },
    { name: "PANCAM", full_name: "Panoramic Camera" },
  ],
}

export default function MarsRoverGallery() {
  const [rover, setRover] = useState("curiosity")
  const [camera, setCamera] = useState("FHAZ")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPhotos, setTotalPhotos] = useState(0)

  useEffect(() => {
    // Reset camera when rover changes
    if (CAMERAS[rover]) {
      setCamera(CAMERAS[rover][0].name)
    }
  }, [rover])

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/mars-rover?rover=${rover}&camera=${camera}`)
        if (!response.ok) {
          throw new Error("Failed to fetch rover photos")
        }
        const data: RoverData = await response.json()
        setPhotos(data.photos)
        setTotalPhotos(data.total_photos)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load rover photos")
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [rover, camera])

  const roverData = ROVERS.find((r) => r.value === rover)
  const cameras = CAMERAS[rover] || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mars Rover Photos</h1>
        <p className="text-foreground/70">Explore stunning photos captured by NASA's rovers on the Red Planet</p>
      </div>

      {/* Controls */}
      <Card className="bg-card/50 border-border/50 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Rover</label>
            <Select value={rover} onValueChange={setRover}>
              <SelectTrigger className="bg-input border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {ROVERS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.name} {!r.active && "(Inactive)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Camera</label>
            <Select value={camera} onValueChange={setCamera}>
              <SelectTrigger className="bg-input border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {cameras.map((cam) => (
                  <SelectItem key={cam.name} value={cam.name}>
                    {cam.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {roverData && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <p className="text-sm text-foreground/70">
              <span className="font-semibold">{roverData.name}</span> rover - {roverData.active ? "Active" : "Inactive"}
            </p>
            {totalPhotos > 0 && (
              <p className="text-xs text-foreground/60 mt-1">
                {totalPhotos.toLocaleString()} photos available from this rover
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="bg-destructive/10 border-destructive/50 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <p className="text-foreground/70 mt-2 text-sm">Please make sure your NASA API key is configured</p>
        </Card>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && !loading && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="bg-card/50 border-border/50 overflow-hidden hover:border-border transition-colors group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={photo.img_src || "/placeholder.svg"}
                    alt={`${photo.rover.name} photo from ${photo.earth_date}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-xs text-foreground/60">
                    <Calendar className="w-3 h-3" />
                    {new Date(photo.earth_date).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-foreground/70 line-clamp-2">{photo.camera.full_name}</p>
                </div>
              </Card>
            ))}
          </div>

          {photos.length === 0 && !loading && (
            <Card className="bg-card/50 border-border/50 p-8 text-center">
              <p className="text-foreground/70">No photos available for this rover and camera combination</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
