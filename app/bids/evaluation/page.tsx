"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockTenders, mockBids } from "@/lib/mock-data"
import { ArrowLeft, Eye, EyeOff, Trophy, AlertCircle, CheckCircle, Lock, Unlock } from "lucide-react"
import Link from "next/link"

interface EvaluationCriteria {
  technical: number
  price: number
  compliance: number
  experience: number
}

export default function BidEvaluationPage() {
  const { user } = useAuth()
  const [selectedTender, setSelectedTender] = useState<string>("1")
  const [isAnonymized, setIsAnonymized] = useState(true)
  const [bidsOpened, setBidsOpened] = useState(false)

  // Redirect if not procuring officer
  if (user?.role !== "procuring_officer") {
    return <div>Access denied</div>
  }

  const tender = mockTenders.find((t) => t.id === selectedTender)
  const tenderBids = mockBids.filter((b) => b.tenderId === selectedTender)

  const handleOpenBids = async () => {
    // Simulate automated bid opening
    setBidsOpened(true)
    // In real implementation, this would trigger blockchain transaction
  }

  const calculateWeightedScore = (bid: any): number => {
    if (!bid.technicalScore || !bid.complianceScore) return 0

    const priceScore = tender ? Math.max(0, 100 - ((bid.amount - tender.budget) / tender.budget) * 100) : 0
    const weights = { technical: 0.4, price: 0.3, compliance: 0.3 }

    return (
      bid.technicalScore * weights.technical + priceScore * weights.price + bid.complianceScore * weights.compliance
    )
  }

  const rankedBids = [...tenderBids]
    .filter((bid) => bid.totalScore)
    .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))

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
            <div>
              <h1 className="text-3xl font-bold text-balance">Bid Evaluation Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive bid analysis and winner selection</p>
            </div>
          </div>

          {/* Tender Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Tender for Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTender} onValueChange={setSelectedTender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a tender" />
                </SelectTrigger>
                <SelectContent>
                  {mockTenders
                    .filter((t) => t.status === "closed" || t.status === "published")
                    .map((tender) => (
                      <SelectItem key={tender.id} value={tender.id}>
                        {tender.title} - {tender.bidCount} bids
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {tender && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bids">Bid Analysis</TabsTrigger>
                <TabsTrigger value="scoring">Scoring Matrix</TabsTrigger>
                <TabsTrigger value="winner">Winner Selection</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tender Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Title</p>
                        <p className="font-semibold">{tender.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold">${tender.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bids Received</p>
                        <p className="font-semibold">{tenderBids.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge>{tender.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluation Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!bidsOpened ? (
                        <div className="space-y-4">
                          <Alert>
                            <Lock className="h-4 w-4" />
                            <AlertDescription>
                              Bids are currently sealed. Click below to perform automated bid opening.
                            </AlertDescription>
                          </Alert>
                          <Button onClick={handleOpenBids} className="w-full">
                            <Unlock className="mr-2 h-4 w-4" />
                            Open Bids (Automated)
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>Bids have been opened and are ready for evaluation.</AlertDescription>
                          </Alert>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Anonymized View</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsAnonymized(!isAnonymized)}
                              className="bg-transparent"
                            >
                              {isAnonymized ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Show Vendors
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Hide Vendors
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bids" className="space-y-6">
                {!bidsOpened ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please open bids first to view bid analysis.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {tenderBids.map((bid, index) => (
                      <Card key={bid.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-semibold">
                                {isAnonymized ? `Bidder ${String.fromCharCode(65 + index)}` : bid.vendorName}
                              </h3>
                              <div className="grid gap-2 md:grid-cols-3">
                                <div>
                                  <p className="text-sm text-muted-foreground">Bid Amount</p>
                                  <p className="font-semibold">${bid.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Technical Score</p>
                                  <p className="font-semibold">{bid.technicalScore || "Pending"}/100</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                                  <p className="font-semibold">{bid.complianceScore || "Pending"}/100</p>
                                </div>
                              </div>
                            </div>
                            <Badge variant={bid.status === "winner" ? "default" : "secondary"}>{bid.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="scoring" className="space-y-6">
                {!bidsOpened ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please open bids first to view scoring matrix.</AlertDescription>
                  </Alert>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluation Criteria & Weights</CardTitle>
                      <CardDescription>Weighted scoring matrix for bid evaluation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Technical (40%)</span>
                              <span className="text-sm text-muted-foreground">40 points</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Price (30%)</span>
                              <span className="text-sm text-muted-foreground">30 points</span>
                            </div>
                            <Progress value={30} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Compliance (30%)</span>
                              <span className="text-sm text-muted-foreground">30 points</span>
                            </div>
                            <Progress value={30} className="h-2" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold">Bid Scores</h4>
                          {tenderBids.map((bid, index) => {
                            const totalScore = calculateWeightedScore(bid)
                            return (
                              <div key={bid.id} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {isAnonymized ? `Bidder ${String.fromCharCode(65 + index)}` : bid.vendorName}
                                  </span>
                                  <span className="font-semibold">{totalScore.toFixed(1)}/100</span>
                                </div>
                                <Progress value={totalScore} className="h-2" />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="winner" className="space-y-6">
                {!bidsOpened ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please open bids first to select winner.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                          Winner Selection
                        </CardTitle>
                        <CardDescription>Ranked bids based on evaluation criteria</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {rankedBids.map((bid, index) => (
                            <div
                              key={bid.id}
                              className={`p-4 rounded-lg border ${
                                index === 0 ? "border-yellow-200 bg-yellow-50" : "border-border"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                      index === 0
                                        ? "bg-yellow-600 text-white"
                                        : index === 1
                                          ? "bg-gray-400 text-white"
                                          : index === 2
                                            ? "bg-orange-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {isAnonymized ? `Bidder ${String.fromCharCode(65 + index)}` : bid.vendorName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      ${bid.amount.toLocaleString()} • Score: {bid.totalScore}/100
                                    </p>
                                  </div>
                                </div>
                                {index === 0 && (
                                  <Badge variant="default" className="bg-yellow-600">
                                    <Trophy className="mr-1 h-3 w-3" />
                                    Winner
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {rankedBids.length > 0 && (
                          <div className="mt-6 pt-6 border-t">
                            <Button className="w-full" size="lg">
                              Confirm Winner Selection
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
