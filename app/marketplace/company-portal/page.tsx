"use client";

import { useState } from "react";
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
import { mockProducts, mockCompanySignatures } from "@/lib/mock-data";
import {
  Plus,
  Key,
  Shield,
  Hash,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function CompanyPortalPage() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isVerified, setIsVerified] = useState(false);
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

  const handleVerifySignature = () => {
    // Mock verification process
    if (privateKey && selectedCompany) {
      setIsVerified(true);
    }
  };

  const handleAddProduct = () => {
    if (!isVerified) return;

    // Mock product addition with digital signature
    const signature = `SIG_${selectedCompany.toUpperCase()}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;

    console.log("[auctra] Adding new product with signature:", signature);
    console.log("[auctra] Blockchain hash:", blockchainHash);

    // Reset form
    setNewProduct({
      name: "",
      category: "",
      description: "",
      price: "",
      specifications: "",
    });
  };

  const handleUpdatePrice = () => {
    if (!isVerified) return;

    // Mock price update with digital signature
    const signature = `SIG_${selectedCompany.toUpperCase()}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;
    const blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;

    console.log("[auctra] Updating price with signature:", signature);
    console.log("[auctra] New blockchain hash:", blockchainHash);

    // Reset form
    setPriceUpdate({
      productId: "",
      newPrice: "",
    });
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
                      {mockCompanySignatures.map((company) => (
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
                    placeholder="Enter your private key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                  />
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
                    Your Public Key
                  </div>
                  <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                    {
                      mockCompanySignatures.find(
                        (c) => c.companyName === selectedCompany
                      )?.publicKey
                    }
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
                      !isVerified || !newProduct.name || !newProduct.price
                    }
                    className="w-full"
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    Add Product with Digital Signature
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
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ${product.price.toLocaleString()}
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
                      !priceUpdate.newPrice
                    }
                    className="w-full"
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    Update Price with Digital Signature
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
