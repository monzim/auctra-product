"use client";

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
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Office Chairs",
    description: "Ergonomic office chairs",
    price: "50000",
    company: "FurnitureCo",
    hash: "0x1a2b3c...",
  },
  {
    id: 2,
    name: "Laptops",
    description: "High-performance laptops",
    price: "200000",
    company: "TechSupplies",
    hash: "0x4d5e6f...",
  },
  {
    id: 3,
    name: "Printers",
    description: "Multi-function printers",
    price: "80000",
    company: "PrintSolutions",
    hash: "0x7g8h9i...",
  },
  {
    id: 4,
    name: "Desks",
    description: "Adjustable standing desks",
    price: "120000",
    company: "FurnitureCo",
    hash: "0xj0k1l2...",
  },
];

export default function Catalog() {
  const [products, setProducts] = useState(initialProducts);
  const [searchHash, setSearchHash] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = () => {
    const product = products.find((p) => p.hash.includes(searchHash));
    setSelectedProduct(product || null);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Browse all available products for government procurement
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
          {selectedProduct && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Hash Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Product:</strong> {selectedProduct.name}
                </p>
                <p>
                  <strong>Company:</strong> {selectedProduct.company}
                </p>
                <p>
                  <strong>Hash:</strong> {selectedProduct.hash}
                </p>
              </CardContent>
            </Card>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price (BDT)</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/catalog/${product.id}`}
                      className="text-primary hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {parseInt(product.price).toLocaleString()} BDT
                  </TableCell>
                  <TableCell>{product.company}</TableCell>
                  <TableCell>{product.hash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
