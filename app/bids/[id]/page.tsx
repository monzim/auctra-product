"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { mockBids, mockTenders } from "@/lib/mock-data"
import { ArrowLeft, FileText, Shield, Download, Hash } from "lucide-react"
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

export default function BidDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const bidId = params.id as string

  const bid = mockBids.find((b) => b.id === bidId)
  const tender = bid ? mockTenders.find((t) => t.id === bid.tenderId) : null

  if (!bid || !tender) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Bid not found.</p>
              <Button asChild className="mt-4">
                <Link href="/bids">Back to Bids</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  // Check access permissions
  const canView = user?.role === "procuring_officer" || (user?.role === "vendor" && bid.vendorId === user.id)

  if (!canView) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Access denied.</p>
              <Button asChild className="mt-4">
                <Link href="/bids">Back to Bids</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/bids">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bids
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-balance">Bid Details</h1>
                <Badge variant={statusColors[bid.status]}>{statusLabels[bid.status]}</Badge>
              </div>
              <p className="text-muted-foreground">{tender.title}</p>
            </div>
            {user?.role === "procuring_officer" && bid.status === "submitted" && (
              <Button asChild>
                <Link href={`/bids/${bid.id}/evaluate`}>Evaluate Bid</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-semibold">{bid.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bid Amount</p>
                      <p className="font-semibold">${bid.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submission Date</p>
                      <p className="font-semibold">{new Date(bid.submissionDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={statusColors[bid.status]}>{statusLabels[bid.status]}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {bid.status === "evaluated" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Scores</CardTitle>
                    <CardDescription>Detailed scoring breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{bid.technicalScore}/100</p>
                        <p className="text-sm text-muted-foreground">Technical Score</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{bid.complianceScore}/100</p>
                        <p className="text-sm text-muted-foreground">Compliance Score</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{bid.totalScore}/100</p>
                        <p className="text-sm text-muted-foreground">Total Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                  <CardDescription>Documents provided with this bid</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bid.documents.map((document, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{document}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {bid.digitalSignature && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Digital Signature
                    </CardTitle>
                    <CardDescription>Cryptographic proof of bid authenticity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Signature Hash</p>
                      <p className="text-xs font-mono bg-muted p-2 rounded break-all">{bid.digitalSignature}</p>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Verify Signature
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Title</p>
                    <p className="font-semibold">{tender.title}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">${tender.budget.toLocaleString()}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold">{tender.category}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Closing Date</p>
                    <p className="font-semibold">{new Date(tender.closingDate).toLocaleDateString()}</p>
                  </div>

                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href={`/tenders/${tender.id}`}>View Tender Details</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bid Comparison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Bid vs Budget</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${bid.amount.toLocaleString()}</span>
                      <Badge variant={bid.amount <= tender.budget ? "default" : "destructive"}>
                        {bid.amount <= tender.budget ? "Within Budget" : "Over Budget"}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Competition</p>
                    <p className="font-semibold">{tender.bidCount} total bids</p>
                  </div>
                </CardContent>
              </Card>

              {tender.blockchainHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Blockchain Record
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Transaction Hash</p>
                      <p className="text-xs font-mono bg-muted p-2 rounded break-all">{tender.blockchainHash}</p>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Verify on Blockchain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
