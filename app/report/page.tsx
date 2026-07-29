"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertTriangle } from "lucide-react"

const crimeTypes = [
  { id: 1, name: "Theft", severity: "MEDIUM" },
  { id: 2, name: "Assault", severity: "HIGH" },
  { id: 3, name: "Burglary", severity: "HIGH" },
  { id: 4, name: "Vandalism", severity: "LOW" },
  { id: 5, name: "Drug Offense", severity: "MEDIUM" },
  { id: 6, name: "Fraud", severity: "MEDIUM" },
  { id: 7, name: "Robbery", severity: "HIGH" },
  { id: 8, name: "Domestic Violence", severity: "CRITICAL" },
  { id: 9, name: "Cybercrime", severity: "MEDIUM" },
  { id: 10, name: "Traffic Violation", severity: "LOW" },
]

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    crimeType: "",
    incidentDate: "",
    incidentTime: "",
    locationAddress: "",
    latitude: "",
    longitude: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }))
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Unable to get current location. Please enter manually.")
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="lg:pl-64">
          <div className="p-6">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted Successfully</h2>
                <p className="text-gray-600 mb-4">
                  Your crime report has been submitted and assigned a case number. You will receive updates on the
                  investigation progress.
                </p>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Report Crime Incident</h1>
              <p className="text-gray-600 mt-2">
                Provide detailed information about the crime incident. All fields marked with * are required.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help with the investigation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Incident Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Brief description of the incident"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="crimeType">Crime Type *</Label>
                      <Select value={formData.crimeType} onValueChange={(value) => handleChange("crimeType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crime type" />
                        </SelectTrigger>
                        <SelectContent>
                          {crimeTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name} ({type.severity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Provide a detailed description of what happened, including any relevant circumstances, witnesses, or evidence..."
                      rows={4}
                      required
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Incident Date *</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        value={formData.incidentDate}
                        onChange={(e) => handleChange("incidentDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="incidentTime">Incident Time *</Label>
                      <Input
                        id="incidentTime"
                        type="time"
                        value={formData.incidentTime}
                        onChange={(e) => handleChange("incidentTime", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="locationAddress">Location Address *</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Use Current Location</span>
                      </Button>
                    </div>
                    <Input
                      id="locationAddress"
                      value={formData.locationAddress}
                      onChange={(e) => handleChange("locationAddress", e.target.value)}
                      placeholder="Street address, city, state"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude (Optional)</Label>
                        <Input
                          id="latitude"
                          value={formData.latitude}
                          onChange={(e) => handleChange("latitude", e.target.value)}
                          placeholder="e.g., 40.7128"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude (Optional)</Label>
                        <Input
                          id="longitude"
                          value={formData.longitude}
                          onChange={(e) => handleChange("longitude", e.target.value)}
                          placeholder="e.g., -74.0060"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting Report..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
