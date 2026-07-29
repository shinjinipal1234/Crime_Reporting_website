import { requireAuth } from "@/lib/auth"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, FileText, TrendingUp, MapPin, Clock, CheckCircle, XCircle, Eye, LogOut } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const recentReports = [
  {
    id: 1,
    title: "Bicycle Theft",
    location: "123 Main St",
    date: "2024-01-15",
    status: "INVESTIGATING",
    priority: "MEDIUM",
  },
  {
    id: 2,
    title: "Vandalism in Park",
    location: "Central Park",
    date: "2024-01-14",
    status: "REPORTED",
    priority: "LOW",
  },
  {
    id: 3,
    title: "Car Break-in",
    location: "456 Oak Ave",
    date: "2024-01-13",
    status: "RESOLVED",
    priority: "HIGH",
  },
]

const stats = {
  totalReports: 156,
  activeInvestigations: 23,
  resolvedCases: 98,
  avgResponseTime: "2.4 hours",
}

export default async function DashboardPage() {
  const user = await requireAuth()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "REPORTED":
        return <Clock className="h-4 w-4" />
      case "INVESTIGATING":
        return <Eye className="h-4 w-4" />
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />
      case "CLOSED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REPORTED":
        return "bg-yellow-100 text-yellow-800"
      case "INVESTIGATING":
        return "bg-blue-100 text-blue-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "URGENT":
        return "bg-red-200 text-red-900"
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.full_name}</h1>
            <p className="text-gray-600 mt-2">Here's an overview of crime reporting activity in your area.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReports}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInvestigations}</div>
                <p className="text-xs text-muted-foreground">Currently investigating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resolvedCases}</div>
                <p className="text-xs text-muted-foreground">63% resolution rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">-15% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/report">
                  <Button className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Report New Crime
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/heatmap">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Crime Heatmap
                  </Button>
                </Link>
                <Link href="/logout">
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest crime incidents in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{report.title}</h4>
                          <Badge className={getStatusColor(report.status)}>
                            {getStatusIcon(report.status)}
                            <span className="ml-1">{report.status}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(report.priority)}>
                            {report.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {report.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {report.date}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
