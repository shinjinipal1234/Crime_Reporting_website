"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Filter, Calendar, Eye, EyeOff } from "lucide-react"
import dynamic from "next/dynamic"
const GoogleMap = dynamic(() => import("@/components/GoogleMap"), { ssr: false })
// Mock crime data with coordinates
const crimeData = [
  { id: 1, type: "Theft", lat: 40.7589, lng: -73.9851, severity: "MEDIUM", date: "2024-01-15" },
  { id: 2, type: "Assault", lat: 40.7614, lng: -73.9776, severity: "HIGH", date: "2024-01-14" },
  { id: 3, type: "Burglary", lat: 40.7505, lng: -73.9934, severity: "HIGH", date: "2024-01-13" },
  { id: 4, type: "Vandalism", lat: 40.7549, lng: -73.984, severity: "LOW", date: "2024-01-12" },
  { id: 5, type: "Drug Offense", lat: 40.758, lng: -73.9855, severity: "MEDIUM", date: "2024-01-11" },
  { id: 6, type: "Theft", lat: 40.759, lng: -73.9845, severity: "MEDIUM", date: "2024-01-10" },
  { id: 7, type: "Assault", lat: 40.762, lng: -73.978, severity: "HIGH", date: "2024-01-09" },
  { id: 8, type: "Fraud", lat: 40.751, lng: -73.993, severity: "MEDIUM", date: "2024-01-08" },
  { id: 9, type: "Robbery", lat: 40.7555, lng: -73.9845, severity: "HIGH", date: "2024-01-07" },
  { id: 10, type: "Vandalism", lat: 40.7545, lng: -73.9835, severity: "LOW", date: "2024-01-06" },
]

const neighborhoods = [
  { name: "Times Square", crimeCount: 45, riskLevel: "HIGH" },
  { name: "Central Park", crimeCount: 23, riskLevel: "MEDIUM" },
  { name: "Financial District", crimeCount: 34, riskLevel: "MEDIUM" },
  { name: "Greenwich Village", crimeCount: 18, riskLevel: "LOW" },
  { name: "Upper East Side", crimeCount: 12, riskLevel: "LOW" },
]

export default function HeatmapPage() {
  const [selectedCrimeType, setSelectedCrimeType] = useState("all")
  const [timeRange, setTimeRange] = useState("7days")
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "#10B981" // green
      case "MEDIUM":
        return "#F59E0B" // yellow
      case "HIGH":
        return "#EF4444" // red
      case "CRITICAL":
        return "#DC2626" // dark red
      default:
        return "#6B7280" // gray
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCrimeData = crimeData.filter((crime) => {
    if (selectedCrimeType !== "all" && crime.type.toLowerCase() !== selectedCrimeType) {
      return false
    }
    // Add time range filtering logic here
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crime Heatmap</h1>
            <p className="text-gray-600 mt-2">Interactive map showing crime incidents and hotspots in your area.</p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCrimeType}
                onChange={(e) => setSelectedCrimeType(e.target.value)}
                className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All Crimes</option>
                <option value="theft">Theft</option>
                <option value="assault">Assault</option>
                <option value="burglary">Burglary</option>
                <option value="vandalism">Vandalism</option>
                <option value="drug offense">Drug Offense</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="24hours">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="flex items-center space-x-2"
            >
              {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showHeatmap ? "Hide" : "Show"} Heatmap</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Interactive Crime Map</CardTitle>
                <CardDescription>
                  Click on markers to view incident details. Heatmap intensity indicates crime density.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Google Map with Markers */}
                  <GoogleMap
                    data={filteredCrimeData}
                    mapCenter={{ lat: 40.7589, lng: -73.9851 }}
                    mapZoom={13}
                    onMarkerClick={setSelectedIncident}
                    showHeatmap={showHeatmap}
                  />

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button size="sm" variant="outline" className="bg-white">
                      +
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white">
                      -
                    </Button>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <h4 className="text-sm font-medium mb-2">Crime Severity</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs">Low</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-xs">Medium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs">High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Incident Details */}
                {selectedIncident && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{selectedIncident.type}</h4>
                      <Badge
                        className={`${getSeverityColor(selectedIncident.severity) === "#10B981" ? "bg-green-100 text-green-800" : getSeverityColor(selectedIncident.severity) === "#F59E0B" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                      >
                        {selectedIncident.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Date: {selectedIncident.date}</p>
                      <p>
                        Location: {selectedIncident.lat.toFixed(4)}, {selectedIncident.lng.toFixed(4)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => setSelectedIncident(null)}>
                      Close
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Neighborhood Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Neighborhood Risk Levels</CardTitle>
                <CardDescription>Crime statistics by area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {neighborhoods.map((neighborhood, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{neighborhood.name}</div>
                          <div className="text-sm text-gray-500">{neighborhood.crimeCount} incidents</div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(neighborhood.riskLevel)}>{neighborhood.riskLevel}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crime Statistics Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Map Statistics</CardTitle>
              <CardDescription>Summary of crimes shown on the current map view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredCrimeData.length}</div>
                  <div className="text-sm text-gray-500">Total Incidents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredCrimeData.filter((c) => c.severity === "HIGH").length}
                  </div>
                  <div className="text-sm text-gray-500">High Severity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredCrimeData.filter((c) => c.severity === "MEDIUM").length}
                  </div>
                  <div className="text-sm text-gray-500">Medium Severity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredCrimeData.filter((c) => c.severity === "LOW").length}
                  </div>
                  <div className="text-sm text-gray-500">Low Severity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
