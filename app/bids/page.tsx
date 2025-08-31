"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { mockTenders, mockBids } from "@/lib/mock-data"
import { Search, Eye, Gavel, Calendar, DollarSign, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

const statusColors = {
  submitted: "secondary",
  locked: "outline",
  evaluated: "default",
  winner: "destructive",
  rejected: "destructive",
} as const

const statusLabels = {
  submitted: "Submitted",
  locked: "Locked",
  evaluated: "Evaluated",
  winner: "Winner",
  rejected: "Rejected",
}

function VendorBidsView() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const myBids = mockBids.filter((bid) => bid.vendorId === user?.id)

  const filteredBids = myBids.filter((bid) => {
    const tender = mockTenders.find((t) => t.id === bid.tenderId)
    const matchesSearch = tender?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">My Bids</h1>
        <p className="text-muted-foreground">Track the status of your submitted bids</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBids.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBids.filter((b) => b.status === "winner").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Evaluation</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBids.filter((b) => b.status === "evaluated").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${myBids.reduce((sum, bid) => sum + bid.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
            <SelectItem value="evaluated">Evaluated</SelectItem>
            <SelectItem value="winner">Winner</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {filteredBids.map((bid) => {
          const tender = mockTenders.find((t) => t.id === bid.tenderId)
          return (
            <Card key={bid.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tender?.title}</h3>
                      <Badge variant={statusColors[bid.status]}>{statusLabels[bid.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tender?.category}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${bid.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Submitted {new Date(bid.submissionDate).toLocaleDateString()}</span>
                      </div>
                      {bid.totalScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>Score: {bid.totalScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/tenders/${bid.tenderId}`}>View Tender</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredBids.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bids found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

function OfficerBidsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tenderFilter, setTenderFilter] = useState<string>("all")

  const filteredBids = mockBids.filter((bid) => {
    const tender = mockTenders.find((t) => t.id === bid.tenderId)
    const matchesSearch =
      bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender?.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter
    const matchesTender = tenderFilter === "all" || bid.tenderId === tenderFilter
    return matchesSearch && matchesStatus && matchesTender
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Bid Evaluation</h1>
          <p className="text-muted-foreground">Review and evaluate submitted bids</p>
        </div>
        <Button asChild>
          <Link href="/bids/evaluation">
            <Eye className="mr-2 h-4 w-4" />
            Evaluation Dashboard
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBids.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBids.filter((b) => b.status === "submitted").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBids.filter((b) => b.status === "evaluated").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners Selected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBids.filter((b) => b.status === "winner").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bids or vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={tenderFilter} onValueChange={setTenderFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tenders</SelectItem>
            {mockTenders.map((tender) => (
              <SelectItem key={tender.id} value={tender.id}>
                {tender.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
            <SelectItem value="evaluated">Evaluated</SelectItem>
            <SelectItem value="winner">Winner</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        {filteredBids.map((bid) => {
          const tender = mockTenders.find((t) => t.id === bid.tenderId)
          return (
            <Card key={bid.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{bid.vendorName}</h3>
                      <Badge variant={statusColors[bid.status]}>{statusLabels[bid.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tender?.title}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${bid.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Submitted {new Date(bid.submissionDate).toLocaleDateString()}</span>
                      </div>
                      {bid.totalScore && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>Score: {bid.totalScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/bids/${bid.id}`}>View Details</Link>
                    </Button>
                    {bid.status === "submitted" && (
                      <Button asChild size="sm">
                        <Link href={`/bids/${bid.id}/evaluate`}>Evaluate</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredBids.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bids found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default function BidsPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6">{user.role === "procuring_officer" ? <OfficerBidsView /> : <VendorBidsView />}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
