"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { mockProducts, mockCompanySignatures } from "@/lib/mock-data"
import { Shield, CheckCircle, XCircle, Clock } from "lucide-react"

export default function VerifyProductPage() {
  const params = useParams()
  const productId = params.id as string
  const product = mockProducts.find((p) => p.id === productId)
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean
    message: string
    details?: any
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  if (!product) {
    return <div>Product not found</div>
  }

  const companySignature = mockCompanySignatures.find((sig) => sig.companyName === product.vendorName)

  const handleVerifyData = async () => {
    setIsVerifying(true)

    // Mock verification process
    setTimeout(() => {
      // Simulate verification logic
      const isValid = Math.random() > 0.1 // 90% success rate for demo

      setVerificationResult({
        isValid,
        message: isValid
          ? "All data signatures and blockchain hashes are valid"
          : "Verification failed - data may have been tampered with",
        details: {
          signatureValid: isValid,
          blockchainValid: isValid,
          timestampValid: isValid,
          publicKeyMatch: isValid,
        },
      })
      setIsVerifying(false)
    }, 2000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Data Verification</h1>
            <p className="text-muted-foreground">
              Verify the authenticity and integrity of product data using blockchain and digital signatures
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Data to be verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <div className="p-2 bg-muted rounded">{product.name}</div>
                </div>

                <div className="space-y-2">
                  <Label>Current Price</Label>
                  <div className="p-2 bg-muted rounded">${product.price.toLocaleString()}</div>
                </div>

                <div className="space-y-2">
                  <Label>Company</Label>
                  <div className="p-2 bg-muted rounded">{product.vendorName}</div>
                </div>

                <div className="space-y-2">
                  <Label>Last Updated</Label>
                  <div className="p-2 bg-muted rounded">{new Date(product.lastUpdated).toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verification Details
                </CardTitle>
                <CardDescription>Cryptographic verification information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Public Key</Label>
                  <div className="font-mono text-xs bg-muted p-2 rounded break-all">{companySignature?.publicKey}</div>
                </div>

                <div className="space-y-2">
                  <Label>Latest Digital Signature</Label>
                  <div className="font-mono text-xs bg-muted p-2 rounded">
                    {product.priceHistory[product.priceHistory.length - 1]?.digitalSignature}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Latest Blockchain Hash</Label>
                  <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                    {product.priceHistory[product.priceHistory.length - 1]?.blockchainHash}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Blockchain Confirmations</Label>
                  <div className="p-2 bg-muted rounded">
                    {product.blockchainVerifications[0]?.confirmations} confirmations
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
              <CardDescription>Click to verify the authenticity and integrity of all product data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleVerifyData} disabled={isVerifying} className="w-full" size="lg">
                {isVerifying ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Data...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify Data Integrity
                  </>
                )}
              </Button>

              {verificationResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    verificationResult.isValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {verificationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${verificationResult.isValid ? "text-green-800" : "text-red-800"}`}>
                      {verificationResult.isValid ? "Verification Successful" : "Verification Failed"}
                    </span>
                  </div>

                  <p className={`text-sm mb-4 ${verificationResult.isValid ? "text-green-700" : "text-red-700"}`}>
                    {verificationResult.message}
                  </p>

                  {verificationResult.details && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Verification Details:</div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Digital Signature:</span>
                          <Badge variant={verificationResult.details.signatureValid ? "default" : "destructive"}>
                            {verificationResult.details.signatureValid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Blockchain Hash:</span>
                          <Badge variant={verificationResult.details.blockchainValid ? "default" : "destructive"}>
                            {verificationResult.details.blockchainValid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Timestamp:</span>
                          <Badge variant={verificationResult.details.timestampValid ? "default" : "destructive"}>
                            {verificationResult.details.timestampValid ? "Valid" : "Invalid"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Public Key Match:</span>
                          <Badge variant={verificationResult.details.publicKeyMatch ? "default" : "destructive"}>
                            {verificationResult.details.publicKeyMatch ? "Match" : "No Match"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price History Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Price History Verification</CardTitle>
              <CardDescription>Each price change is individually signed and verified on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.priceHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">${entry.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                      <div className="font-mono text-xs text-muted-foreground">
                        {entry.blockchainHash.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
