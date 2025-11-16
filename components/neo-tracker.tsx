"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, AlertTriangle, Check, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface NEOObject {
  id: string
  name: string
  is_potentially_hazardous_asteroid: boolean
  estimated_diameter: {
    kilometers: {
      estimated_diameter_max: number
      estimated_diameter_min: number
    }
  }
  close_approach_data?: Array<{
    close_approach_date: string
    relative_velocity: {
      kilometers_per_second: string
    }
    miss_distance: {
      kilometers: string
    }
  }>
}

interface NEOData {
  near_earth_objects: Record<string, NEOObject[]>
  page: {
    total_elements: number
  }
}

export default function NEOTracker() {
  const [neoList, setNeoList] = useState<NEOObject[]>([])
  const [filteredList, setFilteredList] = useState<NEOObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hazardousOnly, setHazardousOnly] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchNEOData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/neo-tracker")
        if (!response.ok) {
          throw new Error("Failed to fetch NEO data")
        }
        const data: NEOData = await response.json()

        // Flatten all asteroids from all dates
        const allNEOs = Object.values(data.near_earth_objects || {})
          .flat()
          .slice(0, 20) // Limit to first 20 for display

        setNeoList(allNEOs)
        setFilteredList(allNEOs)
        setTotalCount(data.page?.total_elements || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load NEO data")
        setNeoList([])
        setFilteredList([])
      } finally {
        setLoading(false)
      }
    }

    fetchNEOData()
  }, [])

  // Filter list based on search term and hazardous filter
  useEffect(() => {
    const filtered = neoList.filter((neo) => {
      const matchesSearch = neo.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesHazard = !hazardousOnly || neo.is_potentially_hazardous_asteroid
      return matchesSearch && matchesHazard
    })

    setFilteredList(filtered)
  }, [searchTerm, hazardousOnly, neoList])

  const hazardousCount = neoList.filter((neo) => neo.is_potentially_hazardous_asteroid).length

  const getAverageDiameter = (neo: NEOObject) => {
    const min = neo.estimated_diameter.kilometers.estimated_diameter_min
    const max = neo.estimated_diameter.kilometers.estimated_diameter_max
    return ((min + max) / 2).toFixed(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">NEO Tracker</h1>
        <p className="text-foreground/70">Monitor near-Earth asteroids and track potentially hazardous objects</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card/50 border-border/50 p-6">
          <p className="text-sm text-foreground/60 mb-1">Total Asteroids</p>
          <p className="text-3xl font-bold text-primary">{totalCount.toLocaleString()}</p>
        </Card>
        <Card className="bg-card/50 border-border/50 p-6">
          <p className="text-sm text-foreground/60 mb-1">Potentially Hazardous</p>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <p className="text-3xl font-bold text-destructive">{hazardousCount}</p>
          </div>
        </Card>
        <Card className="bg-card/50 border-border/50 p-6">
          <p className="text-sm text-foreground/60 mb-1">Safe Objects</p>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-500" />
            <p className="text-3xl font-bold text-emerald-500">{neoList.length - hazardousCount}</p>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-card/50 border-border/50 p-6 mb-8">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search asteroids by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input border-border/50"
              />
            </div>
            <Button
              variant={hazardousOnly ? "default" : "outline"}
              onClick={() => setHazardousOnly(!hazardousOnly)}
              className={hazardousOnly ? "bg-destructive hover:bg-destructive/90" : "border-border/50"}
            >
              {hazardousOnly ? "Hazardous Only" : "Show All"}
            </Button>
          </div>
          <p className="text-xs text-foreground/60">
            Showing {filteredList.length} of {neoList.length} asteroids
          </p>
        </div>
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

      {/* NEO Table */}
      {!loading && !error && (
        <Card className="bg-card/50 border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border/30 hover:bg-muted/50">
                  <TableHead className="text-foreground/70">Name</TableHead>
                  <TableHead className="text-foreground/70">Diameter (km)</TableHead>
                  <TableHead className="text-foreground/70">Status</TableHead>
                  <TableHead className="text-right text-foreground/70">Hazard Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((neo) => (
                  <TableRow key={neo.id} className="border-border/30 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground/90">{neo.name}</TableCell>
                    <TableCell className="text-foreground/70">{getAverageDiameter(neo)}</TableCell>
                    <TableCell>
                      {neo.is_potentially_hazardous_asteroid ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="text-destructive text-sm">Hazardous</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm">Safe</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          neo.is_potentially_hazardous_asteroid
                            ? "bg-destructive/20 text-destructive"
                            : "bg-emerald-500/20 text-emerald-500"
                        }`}
                      >
                        {neo.is_potentially_hazardous_asteroid ? "High" : "Low"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredList.length === 0 && !loading && (
            <div className="p-8 text-center">
              <p className="text-foreground/70">No asteroids found matching your criteria</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
