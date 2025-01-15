"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuctraBidV2 } from "@/lib/type";
import { AlertTriangle, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/standalone";
import { Network } from "vis-network/standalone";

const initialBids: AuctraBidV2[] = [
  {
    id: 1,
    contractor: "Tech Solutions Ltd.",
    amount: "520000",
    timestamp: "2023-06-15 14:30",
    status: "Active",
    hash: "0xa1b2c3...",
    publishHash: "0xpub123...",
  },
  {
    id: 2,
    contractor: "BuildIt Corp",
    amount: "480000",
    timestamp: "2023-06-15 15:45",
    status: "Active",
    hash: "0xd4e5f6...",
    publishHash: "0xpub456...",
  },
  {
    id: 3,
    contractor: "InfraPro Services",
    amount: "550000",
    timestamp: "2023-06-15 16:20",
    status: "Completed",
    hash: "0xg7h8i9...",
    publishHash: "0xpub789...",
  },
  {
    id: 4,
    contractor: "ConstructAll Inc.",
    amount: "500000",
    timestamp: "2023-06-15 17:10",
    status: "Active",
    hash: "0xj0k1l2...",
    publishHash: "0xpub012...",
  },
  {
    id: 5,
    contractor: "Tech Solutions Ltd.",
    amount: "510000",
    timestamp: "2023-06-14 10:30",
    status: "Completed",
    hash: "0xm3n4o5...",
    publishHash: "0xpub345...",
  },
  {
    id: 6,
    contractor: "Tech Solutions Ltd.",
    amount: "530000",
    timestamp: "2023-06-13 09:45",
    status: "Completed",
    hash: "0xp6q7r8...",
    publishHash: "0xpub678...",
  },
];

export default function ContractorDetails() {
  const params = useParams();
  const [contractorBids, setContractorBids] = useState([] as AuctraBidV2[]);
  const [showGraph, setShowGraph] = useState(true);
  const networkRef = useRef(null);

  useEffect(() => {
    if (params.contractor) {
      const decodedContractor = decodeURIComponent(params.contractor as string);
      const filteredBids = initialBids.filter(
        (bid) => bid.contractor === decodedContractor
      );
      setContractorBids(filteredBids);
    }
  }, [params.contractor]);

  useEffect(() => {
    if (networkRef.current && contractorBids.length > 0 && showGraph) {
      const nodes = new DataSet(
        contractorBids.map((bid, index) => ({
          id: index,
          label: `Bid ${index + 1}\n${parseInt(
            bid.amount
          ).toLocaleString()} BDT`,
          shape: "dot",
          size: 30,
          color: bid.status === "Active" ? "#82ca9d" : "#8884d8",
        }))
      );

      const edges = new DataSet(
        contractorBids.slice(0, -1).map((_, index) => ({
          id: index,
          from: index,
          to: index + 1,
          arrows: "to",
        }))
      );

      const data = { nodes, edges };

      const options = {
        nodes: {
          font: {
            size: 12,
            face: "Tahoma",
          },
        },
        edges: {
          width: 2,
        },
        layout: {
          hierarchical: {
            direction: "UD",
            sortMethod: "directed",
          },
        },
        physics: false,
      };

      new Network(networkRef.current, data, options);
    }
  }, [contractorBids, showGraph]);

  if (contractorBids.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{contractorBids[0].contractor} - Bid History</CardTitle>
          <CardDescription>
            Detailed view of all bids from this contractor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bid History Graph</h3>
              <Button onClick={() => setShowGraph(!showGraph)}>
                {showGraph ? "Hide Graph" : "Show Graph"}
              </Button>
            </div>
            {showGraph && (
              <div
                ref={networkRef}
                style={{ height: "400px", width: "100%" }}
              />
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bid Amount (BDT)</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Publish Hash</TableHead>
                <TableHead>Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractorBids.map((bid) => (
                <TableRow
                  key={bid.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <span className="font-mono">
                      {parseInt(bid.amount).toLocaleString()}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      BDT
                    </span>
                  </TableCell>
                  <TableCell>{bid.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bid.status === "Active" ? "default" : "secondary"
                      }
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                        >
                          {bid.hash}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bid Hash Details</DialogTitle>
                          <DialogDescription>
                            Information about the bid hash
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>
                            <strong>Hash:</strong> {bid.hash}
                          </p>
                          <p>
                            <strong>Timestamp:</strong> {bid.timestamp}
                          </p>
                          <p>
                            <strong>Bid Amount:</strong>{" "}
                            {parseInt(bid.amount).toLocaleString()} BDT
                          </p>
                          <p className="flex items-center mt-2">
                            {Math.random() > 0.1 ? (
                              <>
                                <Check className="text-green-500 mr-2" />
                                <span>Hash verified on the blockchain</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="text-yellow-500 mr-2" />
                                <span>Hash verification pending</span>
                              </>
                            )}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                        >
                          {bid.publishHash}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Publish Hash Details</DialogTitle>
                          <DialogDescription>
                            Information about the bid&apos;s publish hash
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>
                            <strong>Publish Hash:</strong> {bid.publishHash}
                          </p>
                          <p>
                            <strong>Timestamp:</strong> {bid.timestamp}
                          </p>
                          <p className="flex items-center mt-2">
                            <Check className="text-green-500 mr-2" />
                            <span>Publish hash verified on the blockchain</span>
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    {Math.random() > 0.1 ? (
                      <span className="flex items-center text-green-500">
                        <Check className="mr-2" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-500">
                        <AlertTriangle className="mr-2" />
                        Pending
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
