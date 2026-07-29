"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  HelpCircle,
  FileText,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  Book,
  AlertTriangle,
  Clock,
  Users,
} from "lucide-react"

const helpCategories = [
  { id: "reporting", name: "Reporting", icon: FileText, count: 8 },
  { id: "general", name: "General", icon: HelpCircle, count: 12 },
  { id: "emergency", name: "Emergency", icon: AlertTriangle, count: 5 },
  { id: "privacy", name: "Privacy", icon: Shield, count: 6 },
  { id: "tracking", name: "Tracking", icon: Clock, count: 4 },
]

const helpArticles = [
  {
    id: 1,
    title: "How to Report a Crime",
    content:
      'To report a crime incident, navigate to the "Report Crime" section and fill out the detailed form with accurate information about the incident. Include as much detail as possible including the exact location, time and date, detailed description of what happened, any witnesses present, and any supporting evidence you may have.',
    category: "reporting",
    popular: true,
  },
  {
    id: 2,
    title: "What Information to Include",
    content:
      "When reporting a crime, include: exact location with street address, time and date of incident, detailed description of what happened, description of suspects if applicable, any witnesses and their contact information, photos or videos if available and safe to take, and any other relevant evidence.",
    category: "reporting",
    popular: true,
  },
  {
    id: 3,
    title: "Understanding Crime Status",
    content:
      "Crime reports go through several statuses: REPORTED (initial submission received), INVESTIGATING (case is under active review by authorities), RESOLVED (case closed with successful resolution), CLOSED (case closed without resolution). You will receive notifications as your case status changes.",
    category: "general",
    popular: false,
  },
  {
    id: 4,
    title: "Emergency vs Non-Emergency",
    content:
      "For immediate emergencies where someone is in danger or a crime is in progress, call 911 immediately. Use this system for non-emergency reporting such as past incidents, follow-up on existing cases, or situations that do not require immediate police response.",
    category: "emergency",
    popular: true,
  },
  {
    id: 5,
    title: "Privacy and Confidentiality",
    content:
      "Your personal information is protected and encrypted. Only authorized law enforcement personnel can access your reports. Your identity is kept confidential when possible, though you may be contacted for additional information or to serve as a witness if needed.",
    category: "privacy",
    popular: false,
  },
  {
    id: 6,
    title: "How to Track Your Report",
    content:
      "After submitting a report, you can track its status in your dashboard. You will receive email notifications when there are updates to your case. You can also contact the assigned officer directly if provided with contact information.",
    category: "tracking",
    popular: true,
  },
  {
    id: 7,
    title: "Anonymous Reporting",
    content:
      "You can submit anonymous reports, but this may limit the ability of law enforcement to follow up with you for additional information. Anonymous reports are still valuable for identifying crime patterns and hotspots.",
    category: "reporting",
    popular: false,
  },
  {
    id: 8,
    title: "What Happens After Reporting",
    content:
      "After you submit a report: 1) You receive a confirmation with a case number, 2) The report is reviewed by law enforcement, 3) An officer may be assigned to investigate, 4) You may be contacted for additional information, 5) You receive updates on the case progress.",
    category: "general",
    popular: true,
  },
]

const faqs = [
  {
    question: "How long does it take to process a crime report?",
    answer:
      "Most reports are reviewed within 24-48 hours. High-priority cases are processed immediately, while lower-priority cases may take up to 72 hours for initial review.",
  },
  {
    question: "Can I edit my report after submitting it?",
    answer:
      'You cannot directly edit a submitted report, but you can contact the assigned officer or submit additional information through the "Add Information" feature in your dashboard.',
  },
  {
    question: "Will I need to appear in court?",
    answer:
      "You may be asked to serve as a witness if the case goes to trial. You will be notified well in advance and provided with all necessary information about court proceedings.",
  },
  {
    question: "How do I know if my report led to an arrest?",
    answer:
      "You will be notified of significant developments in your case, including arrests. You can also check your case status in the dashboard for updates.",
  },
  {
    question: "What if I remember additional details later?",
    answer:
      'You can add additional information to your case by logging into your dashboard and using the "Add Information" feature, or by contacting the assigned officer directly.',
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularArticles = helpArticles.filter((article) => article.popular)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-64">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
            <p className="text-gray-600 mt-2">
              Find answers to common questions and get help with using the crime reporting system.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Book className="h-5 w-5" />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === "all" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>All Articles</span>
                        <Badge variant="secondary">{helpArticles.length}</Badge>
                      </div>
                    </button>
                    {helpCategories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedCategory === category.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{category.name}</span>
                            </div>
                            <Badge variant="secondary">{category.count}</Badge>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Need More Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Popular Articles */}
              {selectedCategory === "all" && searchTerm === "" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Popular Articles</span>
                    </CardTitle>
                    <CardDescription>Most frequently accessed help articles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {popularArticles.map((article) => (
                        <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h3 className="font-medium mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{article.content.substring(0, 100)}...</p>
                          <Badge variant="secondary" className="mt-2 capitalize">
                            {article.category}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help Articles */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedCategory === "all"
                      ? "All Articles"
                      : helpCategories.find((c) => c.id === selectedCategory)?.name + " Articles"}
                  </CardTitle>
                  <CardDescription>
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <div key={article.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{article.title}</h3>
                          <div className="flex space-x-2">
                            {article.popular && <Badge variant="secondary">Popular</Badge>}
                            <Badge variant="outline" className="capitalize">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{article.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
