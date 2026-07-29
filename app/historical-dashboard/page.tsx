"use client"

import { useState, useMemo } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import {
  Filter,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react"
import {
  generateHistoricalData,
  getMonthlyStats,
  getDistrictStats,
  getCrimeTypeStats,
  getYearlyComparison,
} from "@/lib/historical-data"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
]

export default function HistoricalDashboard() {
  const [dateRange, setDateRange] = useState("5years")
  const [crimeTypeFilter, setCrimeTypeFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  // Generate and filter data
  const allIncidents = useMemo(() => generateHistoricalData(), [])

  const filteredIncidents = useMemo(() => {
    return allIncidents.filter((incident) => {
      const incidentDate = new Date(incident.date)
      const currentDate = new Date()

      // Date range filter
      let dateMatch = true
      switch (dateRange) {
        case "1year":
          dateMatch =
            incidentDate >= new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
          break
        case "2years":
          dateMatch =
            incidentDate >= new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate())
          break
        case "3years":
          dateMatch =
            incidentDate >= new Date(currentDate.getFullYear() - 3, currentDate.getMonth(), currentDate.getDate())
          break
        case "5years":
        default:
          dateMatch = true
          break
      }

      // Other filters
      const typeMatch = crimeTypeFilter === "all" || incident.type === crimeTypeFilter
      const districtMatch = districtFilter === "all" || incident.location.district === districtFilter
      const severityMatch = severityFilter === "all" || incident.severity === severityFilter
      const yearMatch = selectedYear === "all" || incidentDate.getFullYear().toString() === selectedYear

      return dateMatch && typeMatch && districtMatch && severityMatch && yearMatch
    })
  }, [allIncidents, dateRange, crimeTypeFilter, districtFilter, severityFilter, selectedYear])

  const monthlyStats = useMemo(() => getMonthlyStats(filteredIncidents), [filteredIncidents])
  const districtStats = useMemo(() => getDistrictStats(filteredIncidents), [filteredIncidents])
  const crimeTypeStats = useMemo(() => getCrimeTypeStats(filteredIncidents), [filteredIncidents])
  const yearlyComparison = useMemo(() => getYearlyComparison(filteredIncidents), [filteredIncidents])

  // Calculate summary statistics
  const totalIncidents = filteredIncidents.length
  const resolvedIncidents = filteredIncidents.filter((i) => i.status === "RESOLVED").length
  const resolutionRate = totalIncidents > 0 ? (resolvedIncidents / totalIncidents) * 100 : 0
  const avgResponseTime = filteredIncidents.reduce((sum, i) => sum + i.responseTime, 0) / totalIncidents || 0

  // Get unique values for filters
  const uniqueCrimeTypes = [...new Set(allIncidents.map((i) => i.type))].sort()
  const uniqueDistricts = [...new Set(allIncidents.map((i) => i.location.district))].sort()
  const uniqueYears = [...new Set(allIncidents.map((i) => new Date(i.date).getFullYear()))].sort((a, b) => b - a)

  // Prepare chart data
  const severityData = [
    { name: "Low", value: filteredIncidents.filter((i) => i.severity === "LOW").length, color: "#10B981" },
    { name: "Medium", value: filteredIncidents.filter((i) => i.severity === "MEDIUM").length, color: "#F59E0B" },
    { name: "High", value: filteredIncidents.filter((i) => i.severity === "HIGH").length, color: "#EF4444" },
    { name: "Critical", value: filteredIncidents.filter((i) => i.severity === "CRITICAL").length, color: "#DC2626" },
  ]

  const statusData = [
    { name: "Resolved", value: filteredIncidents.filter((i) => i.status === "RESOLVED").length },
    { name: "Investigating", value: filteredIncidents.filter((i) => i.status === "INVESTIGATING").length },
    { name: "Reported", value: filteredIncidents.filter((i) => i.status === "REPORTED").length },
    { name: "Closed", value: filteredIncidents.filter((i) => i.status === "CLOSED").length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">5-Year Crime Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Comprehensive analysis of crime trends, patterns, and statistics from 2019-2024
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5years">Last 5 Years</SelectItem>
                      <SelectItem value="3years">Last 3 Years</SelectItem>
                      <SelectItem value="2years">Last 2 Years</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specific Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Crime Type</label>
                  <Select value={crimeTypeFilter} onValueChange={setCrimeTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueCrimeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">District</label>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {uniqueDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Actions</label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setDateRange("5years")
                      setCrimeTypeFilter("all")
                      setDistrictFilter("all")
                      setSeverityFilter("all")
                      setSelectedYear("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalIncidents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Filtered from {allIncidents.length.toLocaleString()} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolutionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{resolvedIncidents.toLocaleString()} resolved cases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgResponseTime.toFixed(1)}h</div>
                <p className="text-xs text-muted-foreground">Average investigation time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Districts</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{districtStats.filter((d) => d.incidents > 0).length}</div>
                <p className="text-xs text-muted-foreground">Districts with incidents</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts */}
          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="geographic">Geographic</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Crime Trends</CardTitle>
                    <CardDescription>Incident reports and resolutions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        incidents: { label: "Incidents", color: "hsl(var(--chart-1))" },
                        resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="incidents"
                            stroke="var(--color-incidents)"
                            strokeWidth={2}
                            name="Incidents"
                          />
                          <Line
                            type="monotone"
                            dataKey="resolved"
                            stroke="var(--color-resolved)"
                            strokeWidth={2}
                            name="Resolved"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Yearly Comparison</CardTitle>
                    <CardDescription>Year-over-year crime statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        incidents: { label: "Incidents", color: "hsl(var(--chart-3))" },
                        resolutionRate: { label: "Resolution Rate", color: "hsl(var(--chart-4))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="incidents" fill="var(--color-incidents)" name="Incidents" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Crime Volume Area Chart</CardTitle>
                  <CardDescription>Cumulative view of crime incidents over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      incidents: { label: "Incidents", color: "hsl(var(--chart-1))" },
                      resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="incidents"
                          stackId="1"
                          stroke="var(--color-incidents)"
                          fill="var(--color-incidents)"
                          fillOpacity={0.6}
                          name="Incidents"
                        />
                        <Area
                          type="monotone"
                          dataKey="resolved"
                          stackId="2"
                          stroke="var(--color-resolved)"
                          fill="var(--color-resolved)"
                          fillOpacity={0.6}
                          name="Resolved"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Types Distribution</CardTitle>
                    <CardDescription>Breakdown of incidents by crime type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        count: { label: "Count", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={crimeTypeStats} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="type" type="category" width={100} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Severity Distribution</CardTitle>
                    <CardDescription>Incidents categorized by severity level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Count", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={severityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {severityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Status Distribution</CardTitle>
                    <CardDescription>Current status of all reported cases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        value: { label: "Count", color: "hsl(var(--chart-1))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resolution Rates by Crime Type</CardTitle>
                    <CardDescription>Success rate of case resolution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {crimeTypeStats.slice(0, 8).map((crime, index) => (
                        <div key={crime.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium text-sm">{crime.type}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">{crime.resolutionRate.toFixed(1)}%</div>
                              <div className="text-xs text-gray-500">
                                {crime.resolved}/{crime.count}
                              </div>
                            </div>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${crime.resolutionRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Year-over-Year Comparison</CardTitle>
                  <CardDescription>Detailed comparison of crime statistics across years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {yearlyComparison.map((year, index) => (
                      <div key={year.year} className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{year.year}</div>
                        <div className="text-sm text-gray-500 mt-1">{year.incidents.toLocaleString()} incidents</div>
                        <div className="text-sm text-gray-500">{year.resolutionRate.toFixed(1)}% resolved</div>
                        {index > 0 && (
                          <div className="mt-2">
                            {year.incidents > yearlyComparison[index - 1].incidents ? (
                              <Badge variant="destructive" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />+
                                {(
                                  ((year.incidents - yearlyComparison[index - 1].incidents) /
                                    yearlyComparison[index - 1].incidents) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {(
                                  ((year.incidents - yearlyComparison[index - 1].incidents) /
                                    yearlyComparison[index - 1].incidents) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <ChartContainer
                    config={{
                      incidents: { label: "Incidents", color: "hsl(var(--chart-1))" },
                      resolutionRate: { label: "Resolution Rate", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yearlyComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="incidents" fill="var(--color-incidents)" name="Incidents" />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="resolutionRate"
                          stroke="var(--color-resolutionRate)"
                          name="Resolution Rate %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Geographic Tab */}
            <TabsContent value="geographic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>District Crime Statistics</CardTitle>
                    <CardDescription>Crime incidents and rates by district</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {districtStats.map((district, index) => (
                        <div
                          key={district.district}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <div>
                              <div className="font-medium">{district.district}</div>
                              <div className="text-sm text-gray-500">Pop: {district.population.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{district.incidents} incidents</div>
                            <div className="text-sm text-gray-500">{district.crimeRate.toFixed(1)} per 1K</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Crime Rate by District</CardTitle>
                    <CardDescription>Incidents per 1,000 residents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        crimeRate: { label: "Crime Rate", color: "hsl(var(--chart-3))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={districtStats} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="district" type="category" width={120} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="crimeRate" fill="var(--color-crimeRate)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Simulated Heatmap */}
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Crime Heatmap</CardTitle>
                  <CardDescription>Visual representation of crime density across districts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                      <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%" className="text-gray-400">
                          <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                    </div>

                    {/* District markers */}
                    {districtStats.map((district, index) => (
                      <div
                        key={district.district}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${20 + (index % 4) * 20}%`,
                          top: `${20 + Math.floor(index / 4) * 25}%`,
                        }}
                      >
                        <div
                          className="rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                            width: `${Math.max(20, Math.min(60, district.incidents / 5))}px`,
                            height: `${Math.max(20, Math.min(60, district.incidents / 5))}px`,
                          }}
                        >
                          {district.incidents}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-center whitespace-nowrap">
                          {district.district}
                        </div>
                      </div>
                    ))}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                      <h4 className="text-sm font-medium mb-2">Incident Count</h4>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full bg-blue-300" />
                          <span className="text-xs">Low (0-50)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500" />
                          <span className="text-xs">Medium (51-100)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-blue-700" />
                          <span className="text-xs">High (100+)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time Trends</CardTitle>
                    <CardDescription>Average response time over the years</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        avgResponseTime: { label: "Avg Response Time", color: "hsl(var(--chart-5))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="avgResponseTime"
                            stroke="var(--color-avgResponseTime)"
                            strokeWidth={2}
                            name="Avg Response Time (hours)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resolution Rate Trends</CardTitle>
                    <CardDescription>Case resolution percentage over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        resolutionRate: { label: "Resolution Rate", color: "hsl(var(--chart-2))" },
                      }}
                      className="h-80"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={yearlyComparison}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="resolutionRate"
                            stroke="var(--color-resolutionRate)"
                            fill="var(--color-resolutionRate)"
                            fillOpacity={0.6}
                            name="Resolution Rate %"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics Summary</CardTitle>
                  <CardDescription>Key performance indicators across all years</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">{resolutionRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600 mb-1">Overall Resolution Rate</div>
                      <div className="text-xs text-gray-500">
                        {resolvedIncidents.toLocaleString()} of {totalIncidents.toLocaleString()} cases
                      </div>
                    </div>

                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{avgResponseTime.toFixed(1)}h</div>
                      <div className="text-sm text-gray-600 mb-1">Average Response Time</div>
                      <div className="text-xs text-gray-500">Across all incident types</div>
                    </div>

                    <div className="text-center p-6 border rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{(totalIncidents / 5).toFixed(0)}</div>
                      <div className="text-sm text-gray-600 mb-1">Average Annual Incidents</div>
                      <div className="text-xs text-gray-500">Over 5-year period</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
