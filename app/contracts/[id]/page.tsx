"use client"

import { useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockContracts, mockTenders } from "@/lib/mock-data"
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  CreditCard,
  Thermometer,
  MapPin,
  Droplets,
  Zap,
  Wifi,
  Activity,
} from "lucide-react"
import Link from "next/link"

const milestoneStatusColors = {
  pending: "secondary",
  in_progress: "default",
  completed: "outline",
  verified: "destructive",
  paid: "destructive",
} as const

const milestoneStatusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  verified: "Verified",
  paid: "Paid",
}

const milestoneStatusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  verified: CheckCircle,
  paid: CreditCard,
}

export default function ContractDetailsPage() {
  const params = useParams()
  const { user } = useAuth()
  const contractId = params.id as string

  const contract = mockContracts.find((c) => c.id === contractId)
  const tender = contract ? mockTenders.find((t) => t.id === contract.tenderId) : null

  if (!contract || !tender) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Contract not found.</p>
              <Button asChild className="mt-4">
                <Link href="/contracts">Back to Contracts</Link>
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const progress =
    (contract.milestones.filter((m) => m.status === "completed" || m.status === "verified" || m.status === "paid")
      .length /
      contract.milestones.length) *
    100

  const generateIoTData = (milestoneId: string) => {
    const baseTemp = 22 + Math.random() * 8 // 22-30°C
    const baseHumidity = 45 + Math.random() * 20 // 45-65%
    const basePower = 85 + Math.random() * 10 // 85-95%

    return {
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(baseHumidity),
      powerLevel: Math.round(basePower),
      gpsCoordinates: `${(40.7128 + Math.random() * 0.01).toFixed(6)}, ${(-74.006 + Math.random() * 0.01).toFixed(6)}`,
      lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Within last hour
      deviceStatus: Math.random() > 0.1 ? "online" : "offline",
      signalStrength: Math.round(60 + Math.random() * 35), // 60-95%
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/contracts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contracts
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-balance">{tender.title}</h1>
              <p className="text-muted-foreground">Contract Management & Project Execution</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="contract">Contract Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Progress</CardTitle>
                    <CardDescription>Overall completion status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {
                            contract.milestones.filter(
                              (m) => m.status === "completed" || m.status === "verified" || m.status === "paid",
                            ).length
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {contract.milestones.filter((m) => m.status === "in_progress").length}
                        </p>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contract Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-semibold">${contract.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">
                          {new Date(contract.startDate).toLocaleDateString()} -{" "}
                          {new Date(contract.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Milestones</p>
                        <p className="font-semibold">{contract.milestones.length} total</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest milestone updates and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.milestones
                      .filter((m) => m.status !== "pending")
                      .slice(0, 3)
                      .map((milestone) => {
                        const StatusIcon = milestoneStatusIcons[milestone.status]
                        return (
                          <div key={milestone.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <StatusIcon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{milestone.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={milestoneStatusColors[milestone.status]}>
                              {milestoneStatusLabels[milestone.status]}
                            </Badge>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                  <CardDescription>
                    Track progress and manage milestone deliverables with IoT verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {contract.milestones.map((milestone, index) => {
                      const StatusIcon = milestoneStatusIcons[milestone.status]
                      const isOverdue = new Date(milestone.dueDate) < new Date() && milestone.status === "pending"
                      const iotData = generateIoTData(milestone.id)

                      return (
                        <div key={milestone.id} className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  milestone.status === "completed" ||
                                  milestone.status === "verified" ||
                                  milestone.status === "paid"
                                    ? "bg-green-100 text-green-600"
                                    : milestone.status === "in_progress"
                                      ? "bg-blue-100 text-blue-600"
                                      : isOverdue
                                        ? "bg-red-100 text-red-600"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <StatusIcon className="h-5 w-5" />
                              </div>
                              {index < contract.milestones.length - 1 && <div className="w-px h-16 bg-border mt-2" />}
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{milestone.title}</h3>
                                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant={milestoneStatusColors[milestone.status]}>
                                    {milestoneStatusLabels[milestone.status]}
                                  </Badge>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    ${milestone.amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                                  {isOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                                </div>
                              </div>

                              {(milestone.status === "in_progress" ||
                                milestone.status === "completed" ||
                                milestone.status === "verified") && (
                                <Card className="bg-slate-50 border-slate-200">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <Activity className="h-4 w-4 text-blue-600" />
                                      IoT Sensor Data
                                      <Badge
                                        variant="outline"
                                        className={
                                          iotData.deviceStatus === "online"
                                            ? "border-green-500 text-green-700"
                                            : "border-red-500 text-red-700"
                                        }
                                      >
                                        {iotData.deviceStatus}
                                      </Badge>
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      Real-time monitoring data from project site • Last updated:{" "}
                                      {new Date(iotData.lastUpdate).toLocaleTimeString()}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                          <Thermometer className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Temperature</p>
                                          <p className="font-semibold text-sm">{iotData.temperature}°C</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                          <Droplets className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Humidity</p>
                                          <p className="font-semibold text-sm">{iotData.humidity}%</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                          <Zap className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Power Level</p>
                                          <p className="font-semibold text-sm">{iotData.powerLevel}%</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                          <Wifi className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Signal</p>
                                          <p className="font-semibold text-sm">{iotData.signalStrength}%</p>
                                        </div>
                                      </div>
                                    </div>

                                    <Separator className="my-3" />

                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">GPS Location</p>
                                        <p className="font-mono text-xs">{iotData.gpsCoordinates}</p>
                                      </div>
                                    </div>

                                    {milestone.status === "in_progress" && (
                                      <Alert className="mt-3">
                                        <Activity className="h-4 w-4" />
                                        <AlertDescription className="text-xs">
                                          IoT sensors are actively monitoring this milestone. Automated verification
                                          will trigger when completion criteria are met.
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </CardContent>
                                </Card>
                              )}

                              {milestone.status === "in_progress" && user?.role === "vendor" && (
                                <div className="space-y-3">
                                  <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                      This milestone is currently in progress. Upload verification documents when ready.
                                    </AlertDescription>
                                  </Alert>

                                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <Button variant="outline" size="sm">
                                      Upload Verification Documents
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">Photos, reports, certificates</p>
                                  </div>
                                </div>
                              )}

                              {milestone.documents.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Documents:</p>
                                  {milestone.documents.map((doc, docIndex) => (
                                    <div
                                      key={docIndex}
                                      className="flex items-center justify-between p-2 bg-muted rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{doc}</span>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {milestone.status === "verified" && user?.role === "procuring_officer" && (
                                <Button className="w-full">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Release Payment (${milestone.amount.toLocaleString()})
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contract" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Deliverables</CardTitle>
                    <CardDescription>Key project deliverables and requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {contract.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Level Agreement</CardTitle>
                    <CardDescription>Performance standards and commitments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{contract.sla}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Terms</CardTitle>
                    <CardDescription>Payment schedule and conditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{contract.paymentTerms}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Penalties & Compliance</CardTitle>
                    <CardDescription>Penalty structure for delays and non-compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{contract.penalties}</p>
                  </CardContent>
                </Card>
              </div>

              {contract.blockchainHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Blockchain Verification
                    </CardTitle>
                    <CardDescription>Immutable contract record on blockchain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Contract Hash</p>
                        <p className="text-xs font-mono bg-muted p-2 rounded break-all">{contract.blockchainHash}</p>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        Verify Contract on Blockchain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Documents</CardTitle>
                  <CardDescription>All contract-related documents and attachments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        "Signed_Contract_Agreement.pdf",
                        "Technical_Specifications.pdf",
                        "Project_Timeline.pdf",
                        "Quality_Standards.pdf",
                        "Safety_Requirements.pdf",
                      ].map((document, index) => (
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

                    {user?.role === "vendor" && (
                      <div className="pt-4 border-t">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="mt-4">
                            <Button variant="outline">Upload Additional Documents</Button>
                            <p className="text-sm text-muted-foreground mt-2">
                              Progress reports, change requests, certifications
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
