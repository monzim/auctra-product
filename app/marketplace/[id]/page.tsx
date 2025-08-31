"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { mockProducts } from "@/lib/mock-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, CheckCircle, Clock, Hash, Key, TrendingUp, Verified } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = mockProducts.find((p) => p.id === productId)

  if (!product) {
    return <div>Product not found</div>
  }

  const chartData = product.priceHistory.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    price: entry.price,
    blockchainHash: entry.blockchainHash,
    signature: entry.digitalSignature,
  }))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">{product.name}</h1>
              <p className="text-muted-foreground">
                {product.category} • {product.vendorName}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Current Price</div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pricing">Pricing History</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <img
                        src={product.images[0] || "/placeholder.svg?height=300&width=400&query=product"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-muted-foreground">{product.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Blockchain Verified</span>
                      <Badge variant="secondary">
                        {product.blockchainVerifications[0]?.confirmations} confirmations
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">Digital Signature Valid</span>
                      <Badge variant="outline">Verified</Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span className="text-sm">Last Updated</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(product.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Company Public Key</div>
                      <div className="font-mono text-xs bg-muted p-2 rounded break-all">{product.companyPublicKey}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Price History with Blockchain Verification
                  </CardTitle>
                  <CardDescription>
                    All price changes are recorded on the blockchain and digitally signed by the company
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: any, name: string) => [`$${value.toLocaleString()}`, "Price"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Price Change History</h4>
                    {product.priceHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">${entry.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs">{entry.blockchainHash.slice(0, 10)}...</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs">{entry.digitalSignature}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blockchain" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Verified className="h-5 w-5" />
                    Blockchain Verification Details
                  </CardTitle>
                  <CardDescription>Immutable proof of data integrity and authenticity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {product.blockchainVerifications.map((verification, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Verification #{index + 1}</h4>
                        <Badge variant={verification.verified ? "default" : "destructive"}>
                          {verification.verified ? "Verified" : "Pending"}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Block Hash</div>
                          <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                            {verification.blockHash}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Transaction Hash</div>
                          <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                            {verification.transactionHash}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Timestamp</div>
                          <div className="text-sm">{new Date(verification.timestamp).toLocaleString()}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Gas Used</div>
                          <div className="text-sm">{verification.gasUsed.toLocaleString()}</div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Confirmations</div>
                          <div className="text-sm font-bold text-green-600">{verification.confirmations}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/marketplace/verify/${product.id}`}>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Data Integrity
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 border rounded-lg">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
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
