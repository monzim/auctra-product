"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  ArrowLeft,
  History,
  ExternalLink,
  Database,
  Hash,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface PriceHistoryEntry {
  id: string;
  price: number;
  timestamp: string;
  signature: string;
  localTransactionHash: string;
  publicTransactionHash: string | null;
  previousTransactionId: string | null;
  previousTransaction?: {
    id: string;
    localTransactionHash: string;
    price: number;
    createdAt: string;
  } | null;
  blockchain: {
    blockHash: string;
    blockNumber: number;
    gasUsed: string;
    status: number;
    publicSyncHash: string | null;
    transactionType: string;
    createdAt: string;
  } | null;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: Record<string, any>;
  company: {
    name: string;
    publicKey: string;
    address: string;
  };
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface PricingHistoryData {
  product: Product;
  priceHistory: PriceHistoryEntry[];
  totalEntries: number;
}

export default function PricingHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<PricingHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<PriceHistoryEntry | null>(
    null
  );

  useEffect(() => {
    if (params.id) {
      fetchPricingHistory(params.id as string);
    }
  }, [params.id]);

  const fetchPricingHistory = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/products/${productId}/pricing-history`
      );
      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError(result.error || "Failed to fetch pricing history");
      }
    } catch (err) {
      console.error("Failed to fetch pricing history:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = ((change / previous) * 100).toFixed(2);
    return { change, percentage };
  };

  const PriceVisualizationNode = ({
    entry,
    index,
    previousPrice,
    isLast,
    totalEntries,
  }: {
    entry: PriceHistoryEntry;
    index: number;
    previousPrice: number | null;
    isLast: boolean;
    totalEntries: number;
  }) => {
    const priceChange = previousPrice
      ? getPriceChange(entry.price, previousPrice)
      : null;
    const isIncrease = priceChange && priceChange.change > 0;
    const isDecrease = priceChange && priceChange.change < 0;

    return (
      <div className="flex items-center">
        {/* Connection Line from Previous */}
        {index > 0 && (
          <div className="flex items-center mr-4">
            <div className="h-0.5 w-12 bg-border"></div>
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                isIncrease
                  ? "bg-green-100 text-green-600"
                  : isDecrease
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isIncrease ? (
                <TrendingUp className="h-3 w-3" />
              ) : isDecrease ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
            </div>
            <div className="h-0.5 w-4 bg-border"></div>
          </div>
        )}

        {/* Price Node */}
        <div className={`relative ${index === 0 ? "ml-16" : ""}`}>
          <div
            className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
              selectedNode === entry.id
                ? "border-blue-500 bg-blue-50 shadow-lg scale-110"
                : index === 0
                ? "border-primary bg-primary/10"
                : entry.blockchain?.status === 1
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50"
            } hover:shadow-lg hover:scale-105 transition-all cursor-pointer`}
            onClick={() => {
              setSelectedNode(selectedNode === entry.id ? null : entry.id);
              setSelectedEntry(selectedEntry?.id === entry.id ? null : entry);
            }}
          >
            <div className="text-center">
              <div
                className={`text-sm font-bold ${
                  index === 0 ? "text-primary" : "text-foreground"
                }`}
              >
                ${entry.price.toLocaleString()}
              </div>
              {priceChange && (
                <div
                  className={`text-xs ${
                    isIncrease
                      ? "text-green-600"
                      : isDecrease
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {priceChange.change > 0 ? "+" : ""}
                  {priceChange.percentage}%
                </div>
              )}
            </div>
          </div>

          {/* Node Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-center">
            <div className="font-medium">
              {index === 0 ? "Current" : `Step ${totalEntries - index}`}
            </div>
            <div className="text-muted-foreground">
              {formatDate(entry.timestamp).split(" ")[0]}
            </div>
          </div>

          {/* Verification Badge */}
          {entry.blockchain?.status === 1 && (
            <div className="absolute -top-2 -right-2">
              <CheckCircle className="h-5 w-5 text-green-500 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading pricing history...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !data) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="p-6">
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Error Loading History
              </h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Pricing History</h1>
                <p className="text-muted-foreground">
                  Blockchain-verified price changes for {data.product.name}
                </p>
              </div>
            </div>
            <Badge variant="default">
              <Database className="h-3 w-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>

          {/* Product Overview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{data.product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {data.product.category} • {data.product.company.name}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Current Price
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(data.product.currentPrice)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  {data.totalEntries} price changes
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Created {formatDate(data.product.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Flow Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Price Flow Visualization
              </CardTitle>
              <CardDescription>
                Visual representation of price changes over time with blockchain
                verification.
                <strong>
                  {" "}
                  Click on any node to view detailed transaction information.
                </strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-12">
                <div className="flex items-center justify-start min-w-max gap-0 py-8">
                  {data.priceHistory
                    .slice()
                    .reverse()
                    .map((entry, index) => {
                      const previousPrice =
                        index > 0
                          ? data.priceHistory.slice().reverse()[index - 1].price
                          : null;
                      const isLast = index === data.priceHistory.length - 1;

                      return (
                        <PriceVisualizationNode
                          key={entry.id}
                          entry={entry}
                          index={index}
                          previousPrice={previousPrice}
                          isLast={isLast}
                          totalEntries={data.totalEntries}
                        />
                      );
                    })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/10"></div>
                  <span>Current Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-50"></div>
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Transaction Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-2 w-2 text-green-600" />
                  </div>
                  <span>Price Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                    <TrendingDown className="h-2 w-2 text-red-600" />
                  </div>
                  <span>Price Decrease</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Transaction Details Modal */}
          {selectedEntry && (
            <Card className="border-blue-500 bg-blue-50/50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                        {data.priceHistory.findIndex(
                          (e) => e.id === selectedEntry.id
                        ) + 1}
                      </div>
                      Transaction Details
                    </CardTitle>
                    <CardDescription>
                      Selected price point from visualization
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedNode(null);
                      setSelectedEntry(null);
                    }}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Information */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Price</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(selectedEntry.price)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Timestamp</h4>
                    <div className="text-sm">
                      {formatDate(selectedEntry.timestamp)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Status</h4>
                    <div className="flex items-center gap-2">
                      {selectedEntry.blockchain?.status === 1 ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Local Transaction</h4>
                    <div className="space-y-1">
                      <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                        {selectedEntry.localTransactionHash}
                      </div>
                      {selectedEntry.blockchain && (
                        <div className="text-xs text-muted-foreground">
                          Block #{selectedEntry.blockchain.blockNumber} • Gas:{" "}
                          {selectedEntry.blockchain.gasUsed}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Public Transaction</h4>
                    <div className="space-y-1">
                      {selectedEntry.publicTransactionHash ? (
                        <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                          {selectedEntry.publicTransactionHash}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Not synced to public blockchain
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Digital Signature */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Digital Signature</h4>
                  <div className="text-xs font-mono bg-muted p-2 rounded break-all max-h-20 overflow-y-auto">
                    {selectedEntry.signature}
                  </div>
                </div>

                {/* Previous Transaction Link */}
                {selectedEntry.previousTransaction && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Previous Transaction
                    </h4>
                    <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                      <ChevronRight className="h-4 w-4" />
                      <span>
                        Price:{" "}
                        {formatPrice(selectedEntry.previousTransaction.price)} •
                        Date:{" "}
                        {formatDate(
                          selectedEntry.previousTransaction.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t pt-2">
                  Click on different nodes in the visualization above to explore
                  other transactions
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price History Timeline */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Detailed Transaction History
            </h2>

            {data.priceHistory.map((entry, index) => {
              const isFirst = index === 0;
              const isLast = index === data.priceHistory.length - 1;
              const previousPrice =
                index < data.priceHistory.length - 1
                  ? data.priceHistory[index + 1].price
                  : null;

              const priceChange = previousPrice
                ? getPriceChange(entry.price, previousPrice)
                : null;

              return (
                <Card key={entry.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={isFirst ? "default" : "outline"}>
                            {isFirst
                              ? "Current"
                              : `Change #${data.totalEntries - index}`}
                          </Badge>
                          {entry.blockchain?.status === 1 && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {formatPrice(entry.price)}
                        </div>
                        {priceChange && (
                          <div
                            className={`text-sm ${
                              priceChange.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {priceChange.change > 0 ? "+" : ""}
                            {formatPrice(priceChange.change)}(
                            {priceChange.change > 0 ? "+" : ""}
                            {priceChange.percentage}%)
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Blockchain Transaction Details */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          Local Blockchain
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <Hash className="h-3 w-3" />
                            <span className="font-mono">
                              {entry.localTransactionHash}
                            </span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                          {entry.blockchain && (
                            <>
                              <div className="text-xs text-muted-foreground">
                                Block #{entry.blockchain.blockNumber} • Gas:{" "}
                                {entry.blockchain.gasUsed}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Type: {entry.blockchain.transactionType}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          Public Blockchain
                        </h4>
                        <div className="space-y-1">
                          {entry.publicTransactionHash ? (
                            <div className="flex items-center gap-2 text-xs">
                              <Hash className="h-3 w-3" />
                              <span className="font-mono">
                                {entry.publicTransactionHash}
                              </span>
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Not synced to public blockchain
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Digital Signature */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Digital Signature</h4>
                      <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                        {entry.signature}
                      </div>
                    </div>

                    {/* Link to Previous Transaction */}
                    {entry.previousTransaction && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <ChevronRight className="h-4 w-4" />
                        <span>
                          Linked to previous transaction:{" "}
                          {formatPrice(entry.previousTransaction.price)}
                          on {formatDate(entry.previousTransaction.createdAt)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Company Name</h4>
                  <p className="text-sm">{data.product.company.name}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Blockchain Address</h4>
                  <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {data.product.company.address}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Public Key</h4>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {data.product.company.publicKey}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
