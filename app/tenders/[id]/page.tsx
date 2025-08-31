"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { mockTenders, mockBids } from "@/lib/mock-data"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Users,
  Hash,
  Download,
  Gavel,
  CheckCircle,
} from "lucide-react"
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

export default function TenderDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const tenderId = params.id as string

  const tender = mockTenders.find((t) => t.id === tenderId)
  const tenderBids = mockBids.filter((b) => b.tenderId === tenderId)

  if (!tender) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tender not found.</p>
              <Button asChild className="mt-4">
                <Link href="/tenders">Back to Tenders</Link>
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
              <Link href="/tenders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tenders
              </Link>
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-balance">{tender.title}</h1>
                <Badge variant={statusColors[tender.status]}>{statusLabels[tender.status]}</Badge>
              </div>
              <p className="text-muted-foreground">{tender.category}</p>
            </div>
            {user?.role === "vendor" && tender.status === "published" && (
              <Button asChild>
                <Link href={`/tenders/${tender.id}/bid`}>
                  <Gavel className="mr-2 h-4 w-4" />
                  Submit Bid
                </Link>
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{tender.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>Vendors must meet all the following requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tender.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Download tender documents and specifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tender.documents.map((document, index) => (
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

              {user?.role === "procuring_officer" && tenderBids.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Bids</CardTitle>
                    <CardDescription>Overview of received bids</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tenderBids.map((bid) => (
                        <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{bid.vendorName}</p>
                            <p className="text-sm text-muted-foreground">
                              ${bid.amount.toLocaleString()} • {new Date(bid.submissionDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              bid.status === "winner" ? "default" : bid.status === "evaluated" ? "secondary" : "outline"
                            }
                          >
                            {bid.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={`/bids?tender=${tender.id}`}>View All Bids</Link>
                    </Button>
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
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-semibold">${tender.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-semibold">{tender.organization}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Published</p>
                      <p className="font-semibold">{new Date(tender.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Closing Date</p>
                      <p className="font-semibold">{new Date(tender.closingDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bids Received</p>
                      <p className="font-semibold">{tender.bidCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {tender.blockchainHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Blockchain Verification
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

              <Card>
                <CardHeader>
                  <CardTitle>Procuring Officer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{tender.procuringOfficer}</p>
                    <p className="text-sm text-muted-foreground">{tender.organization}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
