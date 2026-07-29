// Generate mock historical crime data for the past 5 years
export interface CrimeIncident {
  id: number
  date: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  location: {
    district: string
    lat: number
    lng: number
  }
  status: "REPORTED" | "INVESTIGATING" | "RESOLVED" | "CLOSED"
  responseTime: number // hours
}

export interface MonthlyStats {
  month: string
  year: number
  incidents: number
  resolved: number
  avgResponseTime: number
}

export interface DistrictStats {
  district: string
  incidents: number
  crimeRate: number // per 1000 residents
  population: number
}

const crimeTypes = [
  "Theft",
  "Assault",
  "Burglary",
  "Vandalism",
  "Drug Offense",
  "Fraud",
  "Robbery",
  "Domestic Violence",
  "Cybercrime",
  "Traffic Violation",
]
const districts = [
  { name: "Downtown", population: 45000, lat: 40.7589, lng: -73.9851 },
  { name: "University District", population: 32000, lat: 40.7614, lng: -73.9776 },
  { name: "Industrial Zone", population: 18000, lat: 40.7505, lng: -73.9934 },
  { name: "Residential North", population: 28000, lat: 40.7549, lng: -73.984 },
  { name: "Shopping Center", population: 22000, lat: 40.758, lng: -73.9855 },
  { name: "Financial District", population: 35000, lat: 40.759, lng: -73.9845 },
  { name: "Arts Quarter", population: 15000, lat: 40.762, lng: -73.978 },
  { name: "Waterfront", population: 12000, lat: 40.751, lng: -73.993 },
]

// Generate historical data
export function generateHistoricalData(): CrimeIncident[] {
  const incidents: CrimeIncident[] = []
  let id = 1

  for (let year = 2019; year <= 2024; year++) {
    for (let month = 1; month <= 12; month++) {
      // Skip future months in 2024
      if (year === 2024 && month > 1) continue

      const daysInMonth = new Date(year, month, 0).getDate()
      const baseIncidents = Math.floor(Math.random() * 50) + 80 // 80-130 incidents per month

      // Add seasonal variation
      let seasonalMultiplier = 1
      if (month >= 6 && month <= 8) seasonalMultiplier = 1.2 // Summer increase
      if (month === 12 || month === 1) seasonalMultiplier = 1.1 // Holiday increase

      const monthlyIncidents = Math.floor(baseIncidents * seasonalMultiplier)

      for (let i = 0; i < monthlyIncidents; i++) {
        const day = Math.floor(Math.random() * daysInMonth) + 1
        const district = districts[Math.floor(Math.random() * districts.length)]
        const crimeType = crimeTypes[Math.floor(Math.random() * crimeTypes.length)]

        // Assign severity based on crime type
        let severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
        if (["Domestic Violence"].includes(crimeType)) severity = "CRITICAL"
        else if (["Assault", "Robbery", "Burglary"].includes(crimeType)) severity = "HIGH"
        else if (["Theft", "Drug Offense", "Fraud", "Cybercrime"].includes(crimeType)) severity = "MEDIUM"
        else severity = "LOW"

        // Random variation in severity
        const severityRand = Math.random()
        if (severityRand < 0.1) {
          if (severity === "LOW") severity = "MEDIUM"
          else if (severity === "MEDIUM") severity = "HIGH"
          else if (severity === "HIGH") severity = "CRITICAL"
        }

        const status = Math.random() < 0.75 ? "RESOLVED" : Math.random() < 0.8 ? "INVESTIGATING" : "REPORTED"

        incidents.push({
          id: id++,
          date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
          type: crimeType,
          severity,
          location: {
            district: district.name,
            lat: district.lat + (Math.random() - 0.5) * 0.01,
            lng: district.lng + (Math.random() - 0.5) * 0.01,
          },
          status,
          responseTime: Math.random() * 48 + 0.5, // 0.5 to 48.5 hours
        })
      }
    }
  }

  return incidents
}

export function getMonthlyStats(incidents: CrimeIncident[]): MonthlyStats[] {
  const monthlyMap = new Map<string, MonthlyStats>()

  incidents.forEach((incident) => {
    const date = new Date(incident.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const monthName = date.toLocaleDateString("en-US", { month: "short" })
    const year = date.getFullYear()

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, {
        month: monthName,
        year,
        incidents: 0,
        resolved: 0,
        avgResponseTime: 0,
      })
    }

    const stats = monthlyMap.get(key)!
    stats.incidents++
    if (incident.status === "RESOLVED") stats.resolved++
  })

  // Calculate average response times
  monthlyMap.forEach((stats, key) => {
    const monthIncidents = incidents.filter((i) => {
      const date = new Date(i.date)
      return `${date.getFullYear()}-${date.getMonth()}` === key
    })

    const totalResponseTime = monthIncidents.reduce((sum, i) => sum + i.responseTime, 0)
    stats.avgResponseTime = totalResponseTime / monthIncidents.length
  })

  return Array.from(monthlyMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return new Date(`${a.month} 1, 2000`).getMonth() - new Date(`${b.month} 1, 2000`).getMonth()
  })
}

export function getDistrictStats(incidents: CrimeIncident[]): DistrictStats[] {
  const districtMap = new Map<string, number>()

  incidents.forEach((incident) => {
    const district = incident.location.district
    districtMap.set(district, (districtMap.get(district) || 0) + 1)
  })

  return districts
    .map((district) => {
      const incidentCount = districtMap.get(district.name) || 0
      return {
        district: district.name,
        incidents: incidentCount,
        crimeRate: (incidentCount / district.population) * 1000,
        population: district.population,
      }
    })
    .sort((a, b) => b.incidents - a.incidents)
}

export function getCrimeTypeStats(incidents: CrimeIncident[]) {
  const typeMap = new Map<string, { count: number; resolved: number }>()

  incidents.forEach((incident) => {
    if (!typeMap.has(incident.type)) {
      typeMap.set(incident.type, { count: 0, resolved: 0 })
    }
    const stats = typeMap.get(incident.type)!
    stats.count++
    if (incident.status === "RESOLVED") stats.resolved++
  })

  return Array.from(typeMap.entries())
    .map(([type, stats]) => ({
      type,
      count: stats.count,
      resolved: stats.resolved,
      resolutionRate: (stats.resolved / stats.count) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getYearlyComparison(incidents: CrimeIncident[]) {
  const yearlyMap = new Map<number, { incidents: number; resolved: number }>()

  incidents.forEach((incident) => {
    const year = new Date(incident.date).getFullYear()
    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, { incidents: 0, resolved: 0 })
    }
    const stats = yearlyMap.get(year)!
    stats.incidents++
    if (incident.status === "RESOLVED") stats.resolved++
  })

  return Array.from(yearlyMap.entries())
    .map(([year, stats]) => ({
      year,
      incidents: stats.incidents,
      resolved: stats.resolved,
      resolutionRate: (stats.resolved / stats.incidents) * 100,
    }))
    .sort((a, b) => a.year - b.year)
}
