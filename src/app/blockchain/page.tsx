"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateTenderForm } from "@/components/tender/CreateTenderForm";
import { TenderList } from "@/components/tender/TenderList";
import { BidForm } from "@/components/bid/BidForm";
import { TenderData } from "@/lib/blockchain";
import { useBlockchain } from "@/hooks/useBlockchain";
import { Wallet, Link, Plus, List, User } from "lucide-react";

export default function BlockchainPage() {
  const [currentView, setCurrentView] = useState<"list" | "create" | "bid">(
    "list"
  );
  const [selectedTender, setSelectedTender] = useState<TenderData | null>(null);

  const {
    isInitialized,
    isConnected,
    walletAddress,
    loading,
    connectWallet,
    contractAddress,
  } = useBlockchain();

  const handleViewChange = (view: "list" | "create" | "bid") => {
    setCurrentView(view);
    if (view !== "bid") {
      setSelectedTender(null);
    }
  };

  const handleTenderSelect = (tender: TenderData) => {
    setSelectedTender(tender);
    setCurrentView("bid");
  };

  const handleTenderCreated = () => {
    setCurrentView("list");
  };

  const handleBidSubmitted = () => {
    setCurrentView("list");
    setSelectedTender(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Initializing blockchain connection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Blockchain Not Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>To use Auctra&apos;s blockchain features, you need:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>MetaMask or another Web3 wallet installed</li>
                <li>A local Hardhat network running (npx hardhat node)</li>
                <li>The smart contract deployed (npm run chain:deploy)</li>
              </ul>
              <Button onClick={() => window.location.reload()}>
                Retry Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Auctra Blockchain Demo</h1>
        <p className="text-muted-foreground mb-6">
          Experience transparent, immutable public procurement on the blockchain
        </p>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <span className="text-sm">Blockchain:</span>
                  <Badge variant="secondary">Hardhat Local</Badge>
                </div>

                {contractAddress && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Contract:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {contractAddress.slice(0, 8)}...
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <Badge className="font-mono">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </Badge>
                  </div>
                ) : (
                  <Button onClick={connectWallet} size="sm">
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={currentView === "list" ? "default" : "outline"}
          onClick={() => handleViewChange("list")}
        >
          <List className="h-4 w-4 mr-2" />
          View Tenders
        </Button>

        <Button
          variant={currentView === "create" ? "default" : "outline"}
          onClick={() => handleViewChange("create")}
          disabled={!isConnected}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Tender
        </Button>

        {selectedTender && (
          <Button
            variant={currentView === "bid" ? "default" : "outline"}
            onClick={() => handleViewChange("bid")}
            disabled={!isConnected}
          >
            Submit Bid for: {selectedTender.title}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {currentView === "list" && (
          <TenderList onSelectTender={handleTenderSelect} />
        )}

        {currentView === "create" && (
          <CreateTenderForm onSuccess={handleTenderCreated} />
        )}

        {currentView === "bid" && selectedTender && (
          <BidForm
            tender={selectedTender}
            onSuccess={handleBidSubmitted}
            onCancel={() => handleViewChange("list")}
          />
        )}
      </div>

      {/* Instructions */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Government Users:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Connect your MetaMask wallet</li>
                <li>Click &apos;Create Tender&apos; to add a new tender</li>
                <li>Fill in the tender details and submit</li>
                <li>Your tender will be recorded on the blockchain</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">For Contractors:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Connect your MetaMask wallet</li>
                <li>Browse available tenders in &apos;View Tenders&apos;</li>
                <li>
                  Click &apos;View Details&apos; on a tender to submit a bid
                </li>
                <li>Your bid will be permanently recorded on the blockchain</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
