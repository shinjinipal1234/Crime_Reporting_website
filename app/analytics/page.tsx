"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, MapPin, Calendar, BarChart3 } from "lucide-react"

// Mock data for charts and analytics
const crimeStats = {
  totalIncidents: 1247,
  monthlyChange: 8.2,
  resolvedCases: 892,
  resolutionRate: 71.5,
  avgResponseTime: 2.4,
  responseTimeChange: -15.3,
}

const crimeByType = [
  { type: "Theft", count: 324, percentage: 26.0, trend: "up" },
  { type: "Vandalism", count: 198, percentage: 15.9, trend: "down" },
  { type: "Assault", count: 156, percentage: 12.5, trend: "up" },
  { type: "Burglary", count: 134, percentage: 10.7, trend: "down" },
  { type: "Drug Offense", count: 112, percentage: 9.0, trend: "stable" },
  { type: "Fraud", count: 89, percentage: 7.1, trend: "up" },
  { type: "Traffic Violation", count: 78, percentage: 6.3, trend: "down" },
  { type: "Other", count: 156, percentage: 12.5, trend: "stable" },
]

const monthlyTrends = [
  { month: "Jan", incidents: 98, resolved: 72 },
  { month: "Feb", incidents: 87, resolved: 65 },
  { month: "Mar", incidents: 112, resolved: 89 },
  { month: "Apr", incidents: 95, resolved: 78 },
  { month: "May", incidents: 108, resolved: 82 },
  { month: "Jun", incidents: 124, resolved: 95 },
  { month: "Jul", incidents: 134, resolved: 98 },
  { month: "Aug", incidents: 142, resolved: 105 },
  { month: "Sep", incidents: 128, resolved: 92 },
  { month: "Oct", incidents: 156, resolved: 118 },
  { month: "Nov", incidents: 148, resolved: 112 },
  { month: "Dec", incidents: 115, resolved: 86 },
]

const hotspots = [
  { area: "Downtown District", incidents: 234, riskLevel: "HIGH" },
  { area: "University Area", incidents: 189, riskLevel: "MEDIUM" },
  { area: "Industrial Zone", incidents: 156, riskLevel: "MEDIUM" },
  { area: "Residential North", incidents: 98, riskLevel: "LOW" },
  { area: "Shopping Center", incidents: 87, riskLevel: "LOW" },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12months")
  const [crimeFilter, setCrimeFilter] = useState("all")

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crime Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive analysis of crime patterns and trends in your area.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <Select value={crimeFilter} onValueChange={setCrimeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crimes</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="burglary">Burglary</SelectItem>
                  <SelectItem value="vandalism">Vandalism</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{crimeStats.totalIncidents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-red-500" />+{crimeStats.monthlyChange}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{crimeStats.resolvedCases.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{crimeStats.resolutionRate}% resolution rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{crimeStats.avgResponseTime}h</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                  {crimeStats.responseTimeChange}% improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{crimeStats.totalIncidents - crimeStats.resolvedCases}</div>
                <p className="text-xs text-muted-foreground">Currently under investigation</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Crime by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Crime by Type</CardTitle>
                <CardDescription>Distribution of reported crimes by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crimeByType.map((crime, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(crime.trend)}
                        <span className="font-medium">{crime.type}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">{crime.count}</div>
                          <div className="text-sm text-gray-500">{crime.percentage}%</div>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${crime.percentage * 3}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crime Hotspots */}
            <Card>
              <CardHeader>
                <CardTitle>Crime Hotspots</CardTitle>
                <CardDescription>Areas with highest crime activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotspots.map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{hotspot.area}</div>
                          <div className="text-sm text-gray-500">{hotspot.incidents} incidents</div>
                        </div>
                      </div>
                      <Badge className={getRiskColor(hotspot.riskLevel)}>{hotspot.riskLevel}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Crime incidents and resolution rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end justify-between space-x-2">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                    <div className="flex flex-col items-center space-y-1 w-full">
                      <div
                        className="bg-red-200 w-full rounded-t"
                        style={{ height: `${(month.incidents / 160) * 200}px` }}
                        title={`${month.incidents} incidents`}
                      />
                      <div
                        className="bg-green-200 w-full rounded-b"
                        style={{ height: `${(month.resolved / 160) * 200}px` }}
                        title={`${month.resolved} resolved`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-center">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-200 rounded" />
                  <span className="text-sm text-gray-600">Reported</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 rounded" />
                  <span className="text-sm text-gray-600">Resolved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
