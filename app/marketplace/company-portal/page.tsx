"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CryptoService } from "@/lib/crypto-utils";
import { toast } from "sonner";
import {
  Plus,
  Key,
  Shield,
  Hash,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  vendorName: string;
}

export default function CompanyPortalPage() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [companyKeys, setCompanyKeys] = useState<any[]>([]);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    specifications: "",
  });
  const [priceUpdate, setPriceUpdate] = useState({
    productId: "",
    newPrice: "",
  });

  useEffect(() => {
    // Load company keys
    const keys = CryptoService.getPreGeneratedCompanyKeys();
    setCompanyKeys(keys);

    // Load products
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleVerifySignature = () => {
    if (privateKey && selectedCompany) {
      const companyKey = companyKeys.find(
        (k) => k.companyName === selectedCompany
      );
      if (companyKey && privateKey === companyKey.privateKey) {
        setIsVerified(true);
        toast.success("Signature verified successfully!");
      } else {
        toast.error("Invalid private key for selected company");
        setIsVerified(false);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!isVerified) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/blockchain/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: newProduct.name,
          category: newProduct.category,
          description: newProduct.description,
          price: newProduct.price,
          specifications: newProduct.specifications,
          companyName: selectedCompany,
          privateKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastTransaction(data.blockchain);
        toast.success(
          <div>
            <div className="font-semibold">Product added to blockchain!</div>
            <div className="text-sm text-muted-foreground mt-1">
              Local TX: {data.blockchain.localTransactionHash.slice(0, 10)}...
            </div>
            <div className="text-sm text-muted-foreground">
              Public TX: {data.blockchain.publicTransactionHash.slice(0, 10)}...
            </div>
          </div>
        );

        // Reset form
        setNewProduct({
          name: "",
          category: "",
          description: "",
          price: "",
          specifications: "",
        });

        // Refresh products
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrice = async () => {
    if (!isVerified) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/blockchain/update-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: priceUpdate.productId,
          newPrice: priceUpdate.newPrice,
          companyName: selectedCompany,
          privateKey,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastTransaction(data.blockchain);
        toast.success(
          <div>
            <div className="font-semibold">Price updated on blockchain!</div>
            <div className="text-sm text-muted-foreground mt-1">
              Local TX: {data.blockchain.localTransactionHash.slice(0, 10)}...
            </div>
            <div className="text-sm text-muted-foreground">
              Public TX: {data.blockchain.publicTransactionHash.slice(0, 10)}...
            </div>
          </div>
        );

        // Reset form
        setPriceUpdate({
          productId: "",
          newPrice: "",
        });

        // Refresh products
        fetchProducts();
      } else {
        toast.error(data.error || "Failed to update price");
      }
    } catch (error) {
      console.error("Update price error:", error);
      toast.error("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Company Product Portal
            </h1>
            <p className="text-muted-foreground">
              Manage your products with blockchain-verified digital signatures
            </p>
          </div>

          {/* Company Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Company Authentication
              </CardTitle>
              <CardDescription>
                Sign your data with your private key for blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Select
                    value={selectedCompany}
                    onValueChange={setSelectedCompany}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyKeys.map((company) => (
                        <SelectItem
                          key={company.companyName}
                          value={company.companyName}
                        >
                          {company.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privateKey">Private Key</Label>
                  <Input
                    id="privateKey"
                    type="password"
                    placeholder="Copy private key from below (starts with 0x...)"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Copy the private key from the "Your Public Key & Address" section below
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleVerifySignature}
                  disabled={!selectedCompany || !privateKey}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Verify Signature
                </Button>

                {isVerified && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Signature Verified
                    </span>
                  </div>
                )}
              </div>

              {selectedCompany && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">
                    Your Public Key & Address
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                      <div className="text-muted-foreground">Public Key:</div>
                      {
                        companyKeys.find(
                          (c) => c.companyName === selectedCompany
                        )?.publicKey
                      }
                    </div>
                    <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                      <div className="text-muted-foreground">Address:</div>
                      {
                        companyKeys.find(
                          (c) => c.companyName === selectedCompany
                        )?.address
                      }
                    </div>
                    <div className="font-mono text-xs bg-muted p-2 rounded break-all text-destructive">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-bold">Private Key:</div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const key = companyKeys.find(
                              (c) => c.companyName === selectedCompany
                            )?.privateKey;
                            if (key) {
                              setPrivateKey(key);
                              toast.success("Private key copied to input field!");
                            }
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          Copy to Input
                        </Button>
                      </div>
                      {
                        companyKeys.find(
                          (c) => c.companyName === selectedCompany
                        )?.privateKey
                      }
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Management */}
          <Tabs defaultValue="add-product" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="add-product">Add New Product</TabsTrigger>
              <TabsTrigger value="update-price">Update Price</TabsTrigger>
            </TabsList>

            <TabsContent value="add-product">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </CardTitle>
                  <CardDescription>
                    Add a new product with blockchain-verified authenticity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isVerified && (
                    <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-800">
                        Please verify your signature first to add products
                      </span>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        disabled={!isVerified}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                        disabled={!isVerified}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT Hardware">
                            IT Hardware
                          </SelectItem>
                          <SelectItem value="Construction Equipment">
                            Construction Equipment
                          </SelectItem>
                          <SelectItem value="Medical Equipment">
                            Medical Equipment
                          </SelectItem>
                          <SelectItem value="Office Supplies">
                            Office Supplies
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="Enter price"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: e.target.value,
                          })
                        }
                        disabled={!isVerified}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specifications">
                        Specifications (JSON)
                      </Label>
                      <Textarea
                        id="specifications"
                        placeholder='{"key": "value", "key2": "value2"}'
                        value={newProduct.specifications}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            specifications: e.target.value,
                          })
                        }
                        disabled={!isVerified}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      disabled={!isVerified}
                    />
                  </div>

                  <Button
                    onClick={handleAddProduct}
                    disabled={
                      !isVerified ||
                      !newProduct.name ||
                      !newProduct.price ||
                      isLoading
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Hash className="mr-2 h-4 w-4" />
                    )}
                    {isLoading
                      ? "Adding to Blockchain..."
                      : "Add Product with Digital Signature"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="update-price">
              <Card>
                <CardHeader>
                  <CardTitle>Update Product Price</CardTitle>
                  <CardDescription>
                    Update existing product prices with blockchain verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isVerified && (
                    <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-800">
                        Please verify your signature first to update prices
                      </span>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productSelect">Select Product</Label>
                      <Select
                        value={priceUpdate.productId}
                        onValueChange={(value) =>
                          setPriceUpdate({ ...priceUpdate, productId: value })
                        }
                        disabled={!isVerified}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product to update" />
                        </SelectTrigger>
                        <SelectContent>
                          {products
                            .filter((p) => p.vendorName === selectedCompany)
                            .map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - $
                                {product.price.toLocaleString()}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPrice">New Price ($)</Label>
                      <Input
                        id="newPrice"
                        type="number"
                        placeholder="Enter new price"
                        value={priceUpdate.newPrice}
                        onChange={(e) =>
                          setPriceUpdate({
                            ...priceUpdate,
                            newPrice: e.target.value,
                          })
                        }
                        disabled={!isVerified}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdatePrice}
                    disabled={
                      !isVerified ||
                      !priceUpdate.productId ||
                      !priceUpdate.newPrice ||
                      isLoading
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Hash className="mr-2 h-4 w-4" />
                    )}
                    {isLoading
                      ? "Updating on Blockchain..."
                      : "Update Price with Digital Signature"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Latest Transaction Status */}
          {lastTransaction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Latest Blockchain Transaction
                </CardTitle>
                <CardDescription>
                  Transaction details from the most recent blockchain operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Local Blockchain Hash</Label>
                    <div className="font-mono text-xs bg-muted p-2 rounded break-all flex items-center gap-2">
                      {lastTransaction.localTransactionHash}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Public Blockchain Hash</Label>
                    <div className="font-mono text-xs bg-muted p-2 rounded break-all flex items-center gap-2">
                      {lastTransaction.publicTransactionHash}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Block Number</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      #{lastTransaction.blockNumber}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Gas Used</Label>
                    <div className="font-mono text-sm bg-muted p-2 rounded">
                      {lastTransaction.gasUsed} gas
                    </div>
                  </div>
                </div>
                {lastTransaction.linkedToPrevious && (
                  <div className="space-y-2">
                    <Label>Linked to Previous Transaction</Label>
                    <div className="font-mono text-xs bg-blue-50 border border-blue-200 p-2 rounded break-all">
                      {lastTransaction.linkedToPrevious}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
