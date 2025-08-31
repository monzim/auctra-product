"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { mockTenders, mockBids, mockAnalytics } from "@/lib/mock-data"
import { FileText, Gavel, DollarSign, TrendingUp, Clock, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

function ProcuringOfficerDashboard() {
  const activeTenders = mockTenders.filter((t) => t.status === "published")
  const draftTenders = mockTenders.filter((t) => t.status === "draft")
  const closedTenders = mockTenders.filter((t) => t.status === "closed")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Procurement Dashboard</h1>
        <p className="text-muted-foreground">Overview of your procurement activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalTenders}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.activeTenders}</div>
            <p className="text-xs text-muted-foreground">Currently accepting bids</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(mockAnalytics.totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Across all tenders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bids/Tender</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageBidsPerTender}</div>
            <p className="text-xs text-muted-foreground">Healthy competition</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Tenders</CardTitle>
            <CardDescription>Tenders currently accepting bids</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTenders.slice(0, 3).map((tender) => (
              <div key={tender.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{tender.title}</p>
                  <p className="text-xs text-muted-foreground">{tender.category}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{tender.bidCount} bids</Badge>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/tenders">View All Tenders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common procurement tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/tenders/create">
                <FileText className="mr-2 h-4 w-4" />
                Create New Tender
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/bids">
                <Gavel className="mr-2 h-4 w-4" />
                Review Bids
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function VendorDashboard() {
  const { user } = useAuth()
  const myBids = mockBids.filter((b) => b.vendorId === user?.id)
  const availableTenders = mockTenders.filter((t) => t.status === "published")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Track your bids and discover new opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bids</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBids.length}</div>
            <p className="text-xs text-muted-foreground">Active submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTenders.length}</div>
            <p className="text-xs text-muted-foreground">Open for bidding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <p className="text-xs text-muted-foreground">Above industry average</p>
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
            <p className="text-xs text-muted-foreground">Bid submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Recent Bids</CardTitle>
            <CardDescription>Status of your latest submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myBids.map((bid) => {
              const tender = mockTenders.find((t) => t.id === bid.tenderId)
              return (
                <div key={bid.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tender?.title}</p>
                    <p className="text-xs text-muted-foreground">${bid.amount.toLocaleString()}</p>
                  </div>
                  <Badge
                    variant={bid.status === "winner" ? "default" : bid.status === "evaluated" ? "secondary" : "outline"}
                  >
                    {bid.status}
                  </Badge>
                </div>
              )
            })}
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/bids">View All Bids</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Opportunities</CardTitle>
            <CardDescription>Recently published tenders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTenders.slice(0, 3).map((tender) => (
              <div key={tender.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{tender.title}</p>
                  <p className="text-xs text-muted-foreground">${tender.budget.toLocaleString()}</p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/tenders/${tender.id}`}>View</Link>
                </Button>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/tenders">Browse All Tenders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6">
          {user.role === "procuring_officer" ? <ProcuringOfficerDashboard /> : <VendorDashboard />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
