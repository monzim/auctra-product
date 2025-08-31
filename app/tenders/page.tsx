"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { mockTenders } from "@/lib/mock-data"
import { Search, Plus, Calendar, DollarSign, Building, Eye } from "lucide-react"
import Link from "next/link"

const statusColors = {
  draft: "secondary",
  published: "default",
  closed: "outline",
  awarded: "destructive",
} as const

const statusLabels = {
  draft: "Draft",
  published: "Published",
  closed: "Closed",
  awarded: "Awarded",
}

export default function TendersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredTenders = mockTenders.filter((tender) => {
    const matchesSearch =
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter
    const matchesCategory = categoryFilter === "all" || tender.category === categoryFilter

    // Vendors should only see published tenders
    if (user?.role === "vendor" && tender.status !== "published") {
      return false
    }

    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(mockTenders.map((t) => t.category)))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                {user?.role === "procuring_officer" ? "Tender Management" : "Available Tenders"}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === "procuring_officer"
                  ? "Create and manage procurement tenders"
                  : "Browse and bid on published tenders"}
              </p>
            </div>
            {user?.role === "procuring_officer" && (
              <Button asChild>
                <Link href="/tenders/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tender
                </Link>
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {user?.role === "procuring_officer" && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="awarded">Awarded</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tender Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{tender.title}</CardTitle>
                      <CardDescription className="text-sm">{tender.category}</CardDescription>
                    </div>
                    <Badge variant={statusColors[tender.status]}>{statusLabels[tender.status]}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{tender.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${tender.budget.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{tender.organization}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Closes: {new Date(tender.closingDate).toLocaleDateString()}</span>
                    </div>

                    {tender.status === "published" && (
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{tender.bidCount} bids received</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1 bg-transparent">
                      <Link href={`/tenders/${tender.id}`}>View Details</Link>
                    </Button>

                    {user?.role === "vendor" && tender.status === "published" && (
                      <Button asChild className="flex-1">
                        <Link href={`/tenders/${tender.id}/bid`}>Submit Bid</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTenders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tenders found matching your criteria.</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
