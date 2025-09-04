"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { mockProducts } from "@/lib/mock-data";
import {
  Search,
  Plus,
  QrCode,
  Eye,
  LinkIcon,
  Star,
  Database,
  History,
} from "lucide-react";
import Link from "next/link";

interface DatabaseProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  vendorName: string;
  lastUpdated: string;
  specifications?: Record<string, any>;
}

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatabaseProducts();
  }, []);

  const fetchDatabaseProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setDatabaseProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch database products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combine mock products and database products
  const allProducts = [
    ...mockProducts.map((p) => ({ ...p, source: "mock" })),
    ...databaseProducts.map((p) => ({
      ...p,
      source: "database",
      vendorId: p.vendorName,
      vendorName: p.vendorName,
      specifications: p.specifications
        ? JSON.parse(JSON.stringify(p.specifications))
        : {},
      images: ["/placeholder.svg?height=200&width=300&query=product"],
      priceHistory: [],
      companyPublicKey: "",
      lastUpdated: p.lastUpdated,
      blockchainVerifications: [],
    })),
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.price < 50000) ||
      (priceRange === "medium" &&
        product.price >= 50000 &&
        product.price < 200000) ||
      (priceRange === "high" && product.price >= 200000);
    const matchesSource =
      sourceFilter === "all" || product.source === sourceFilter;

    return matchesSearch && matchesCategory && matchesPrice && matchesSource;
  });

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Marketplace</h1>
              <p className="text-muted-foreground">
                {user?.role === "vendor"
                  ? "Showcase your products and link them to relevant tenders"
                  : "Browse vendor products and capabilities"}
              </p>
            </div>
            {user?.role === "vendor" && (
              <Button asChild>
                <Link href="/marketplace/add-product">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockProducts.length} mock + {databaseProducts.length}{" "}
                  blockchain
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
                <Badge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blockchain Products
                </CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {databaseProducts.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  With transaction history
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Vendors
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    Array.from(new Set(allProducts.map((p) => p.vendorName)))
                      .length
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {allProducts.length > 0
                    ? Math.round(
                        allProducts.reduce((sum, p) => sum + p.price, 0) /
                          allProducts.length
                      ).toLocaleString()
                    : "0"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under $50K</SelectItem>
                <SelectItem value="medium">$50K - $200K</SelectItem>
                <SelectItem value="high">Over $200K</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="mock">Mock Products</SelectItem>
                <SelectItem value="database">Blockchain Products</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <img
                        src={
                          `https://picsum.photos/200/?random=${product.id}` ||
                          "/placeholder.svg?height=200&width=300&query=product"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg leading-tight">
                          {product.name}
                        </CardTitle>
                        <Badge
                          variant={
                            product.source === "database"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.source === "database" ? (
                            <>
                              <Database className="h-3 w-3 mr-1" />
                              Blockchain
                            </>
                          ) : (
                            "Mock"
                          )}
                        </Badge>
                      </div>
                      <CardDescription>{product.category}</CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toLocaleString()}
                        </span>
                        <Badge variant="outline">{product.vendorName}</Badge>
                      </div>
                      {product.source === "database" && (
                        <div className="text-xs text-muted-foreground">
                          Last updated:{" "}
                          {new Date(product.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Key Specifications:
                      </h4>
                      <div className="grid gap-1">
                        {Object.entries(product.specifications)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-muted-foreground">
                                {key}:
                              </span>
                              <span>{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {product.source != "database" && (
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          <Link href={`/marketplace/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      )}

                      {product.source === "database" && (
                        <Button asChild variant="destructive">
                          <Link
                            href={`/marketplace/${product.id}/pricing-history`}
                            className="w-full"
                          >
                            <History className="h-4 w-4" /> Price History
                          </Link>
                        </Button>
                      )}

                      {/* {user?.role === "procuring_officer" && (
                      <Button asChild className="flex-1">
                        <Link href={`/marketplace/${product.id}/link-tender`}>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Link to Tender
                        </Link>
                      </Button>
                    )} */}
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <QrCode className="h-4 w-4" />
                        <span>
                          QR Code: PROD_{product.id.toUpperCase()}_2024
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
