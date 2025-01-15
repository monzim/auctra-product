"use client";

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
import { AuctraProductV2 } from "@/lib/type";
import { AlertTriangle, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataSet } from "vis-data/standalone";
import { Network } from "vis-network/standalone";

// This would typically come from an API or database
const getProductDetails = (id: number) => {
  const products: AuctraProductV2[] = [
    {
      id: 1,
      name: "Office Chairs",
      description: "Ergonomic office chairs",
      price: "50000",
      company: "FurnitureCo",
      hash: "0x1a2b3c...",
      publishHash: "0xpub123...",
    },
    {
      id: 2,
      name: "Laptops",
      description: "High-performance laptops",
      price: "200000",
      company: "TechSupplies",
      hash: "0x4d5e6f...",
      publishHash: "0xpub456...",
    },
    {
      id: 3,
      name: "Printers",
      description: "Multi-function printers",
      price: "80000",
      company: "PrintSolutions",
      hash: "0x7g8h9i...",
      publishHash: "0xpub789...",
    },
    {
      id: 4,
      name: "Desks",
      description: "Adjustable standing desks",
      price: "120000",
      company: "FurnitureCo",
      hash: "0xj0k1l2...",
      publishHash: "0xpub012...",
    },
  ];
  return products.find((p) => p.id === Number(id));
};

// Mock price history data with hashes
const getPriceHistory = () => [
  { date: "2023-01-01", price: 48000, hash: "0xabc123..." },
  { date: "2023-02-01", price: 49000, hash: "0xdef456..." },
  { date: "2023-03-01", price: 50000, hash: "0xghi789..." },
  { date: "2023-04-01", price: 51000, hash: "0xjkl012..." },
  { date: "2023-05-01", price: 50000, hash: "0xmno345..." },
  { date: "2023-06-01", price: 50000, hash: "0xpqr678..." },
];

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<AuctraProductV2 | null>(null);
  const [priceHistory, setPriceHistory] = useState<
    { date: string; price: number; hash: string }[]
  >([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const networkRef = useRef(null);

  useEffect(() => {
    if (params.id) {
      const productDetails = getProductDetails(Number(params.id));
      setProduct(productDetails as any);
      setPriceHistory(getPriceHistory());
    }
  }, [params.id]);

  useEffect(() => {
    if (showGraph && networkRef.current) {
      const nodes = new DataSet([
        { id: 1, label: "Product", color: "#8884d8" },
        ...priceHistory.map((entry, index) => ({
          id: index + 2,
          label: entry.date,
          color: "#82ca9d",
        })),
      ]);

      //@ts-ignore
      const edges = new DataSet([
        { from: 1, to: 2 },
        ...priceHistory
          .slice(0, -1)
          .map((_, index) => ({ from: index + 2, to: index + 3 })),
      ]);

      const data = { nodes, edges };

      const options = {
        nodes: {
          shape: "dot",
          size: 16,
        },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18,
          },
          maxVelocity: 146,
          solver: "forceAtlas2Based",
          timestep: 0.35,
          stabilization: { iterations: 150 },
        },
      };

      new Network(networkRef.current, { nodes, edges: edges.get() }, options);
    }
  }, [showGraph, priceHistory]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Current Price:</strong>{" "}
                {parseInt(product.price).toLocaleString()} BDT
              </p>
              <p>
                <strong>Company:</strong> {product.company}
              </p>
              <p>
                <strong>Hash: </strong>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal">
                      {product.hash}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Product Hash Details</DialogTitle>
                      <DialogDescription>
                        Information about the product hash
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        <strong>Product Hash:</strong> {product.hash}
                      </p>
                      <p>
                        <strong>Publish Hash:</strong> {product.publishHash}
                      </p>
                      <p className="flex items-center mt-2">
                        <Check className="text-green-500 mr-2" />
                        <span>Hash verified on the blockchain</span>
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </p>
              <p>
                <strong>Publish Hash: </strong>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal">
                      {product.publishHash}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Publish Hash Details</DialogTitle>
                      <DialogDescription>
                        Information about the product&apos;s publish hash
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        <strong>Publish Hash:</strong> {product.publishHash}
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {new Date().toISOString()}
                      </p>
                      <p className="flex items-center mt-2">
                        <Check className="text-green-500 mr-2" />
                        <span>Publish hash verified on the blockchain</span>
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Price History</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Price (BDT)</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.price.toLocaleString()} BDT</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal"
                        >
                          {entry.hash}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Price Entry Hash Details</DialogTitle>
                          <DialogDescription>
                            Information about the price entry hash on{" "}
                            {entry.date}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>
                            <strong>Date:</strong> {entry.date}
                          </p>
                          <p>
                            <strong>Price:</strong>{" "}
                            {entry.price.toLocaleString()} BDT
                          </p>
                          <p>
                            <strong>Hash:</strong> {entry.hash}
                          </p>
                          <p>
                            <strong>Previous Hash:</strong>{" "}
                            {index > 0 ? priceHistory[index - 1].hash : "N/A"}
                          </p>
                          <p>
                            <strong>Next Hash:</strong>{" "}
                            {index < priceHistory.length - 1
                              ? priceHistory[index + 1].hash
                              : "N/A"}
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
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Price Entry Details</DialogTitle>
                          <DialogDescription>
                            Detailed information about the price entry on{" "}
                            {entry.date}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p>
                            <strong>Date:</strong> {entry.date}
                          </p>
                          <p>
                            <strong>Price:</strong>{" "}
                            {entry.price.toLocaleString()} BDT
                          </p>
                          <p>
                            <strong>Hash:</strong> {entry.hash}
                          </p>
                          <p>
                            <strong>Previous Hash:</strong>{" "}
                            {index > 0 ? priceHistory[index - 1].hash : "N/A"}
                          </p>
                          <p>
                            <strong>Next Hash:</strong>{" "}
                            {index < priceHistory.length - 1
                              ? priceHistory[index + 1].hash
                              : "N/A"}
                          </p>
                          <p className="flex items-center mt-2">
                            {Math.random() > 0.1 ? (
                              <>
                                <Check className="text-green-500 mr-2" />
                                <span>
                                  Price entry verified on the blockchain
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="text-yellow-500 mr-2" />
                                <span>Price entry verification pending</span>
                              </>
                            )}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hash Tracking Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowGraph(!showGraph)}>
            {showGraph ? "Hide Graph" : "Show Graph"}
          </Button>
          {showGraph && (
            <div ref={networkRef} style={{ height: "400px", width: "100%" }} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
