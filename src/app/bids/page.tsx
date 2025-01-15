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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuctraBid } from "@/lib/type";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialBids: AuctraBid[] = [
  {
    id: 1,
    contractor: "Tech Solutions Ltd.",
    amount: "520000",
    timestamp: "2023-06-15 14:30",
    status: "Active",
    hash: "0xa1b2c3...",
  },
  {
    id: 2,
    contractor: "BuildIt Corp",
    amount: "480000",
    timestamp: "2023-06-15 15:45",
    status: "Active",
    hash: "0xd4e5f6...",
  },
  {
    id: 3,
    contractor: "InfraPro Services",
    amount: "550000",
    timestamp: "2023-06-15 16:20",
    status: "Completed",
    hash: "0xg7h8i9...",
  },
  {
    id: 4,
    contractor: "ConstructAll Inc.",
    amount: "500000",
    timestamp: "2023-06-15 17:10",
    status: "Active",
    hash: "0xj0k1l2...",
  },
  {
    id: 5,
    contractor: "Tech Solutions Ltd.",
    amount: "510000",
    timestamp: "2023-06-14 10:30",
    status: "Completed",
    hash: "0xm3n4o5...",
  },
  {
    id: 6,
    contractor: "Tech Solutions Ltd.",
    amount: "530000",
    timestamp: "2023-06-13 09:45",
    status: "Completed",
    hash: "0xp6q7r8...",
  },
];

export default function Bids() {
  const [bids, setBids] = useState(initialBids);
  const [searchHash, setSearchHash] = useState("");

  const handleSearch = () => {
    const filteredBids = initialBids.filter((bid) =>
      bid.hash.includes(searchHash)
    );
    setBids(filteredBids);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Contractor Bids</CardTitle>
          <CardDescription>
            Real-time view of all active and completed bids
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Search by hash..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor</TableHead>
                <TableHead>Bid Amount (BDT)</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => (
                <TableRow
                  key={bid.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/bids/${encodeURIComponent(bid.contractor)}`}
                      className="text-primary hover:underline"
                    >
                      {bid.contractor}
                    </Link>
                  </TableCell>
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
                  <TableCell>{bid.hash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
