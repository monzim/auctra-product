"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
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
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  Shield,
  CheckCircle,
  Clock,
  Trash2,
  Link as GLink,
} from "lucide-react";
import Link from "next/link";
import { mockTenders, mockProducts, type LinkedProduct } from "@/lib/mock-data";

interface BidFormData {
  amount: string;
  technicalProposal: string;
  deliveryTimeline: string;
  warranty: string;
  documents: string[];
  certifications: string[];
  digitalSignature: string;
  linkedProducts: LinkedProduct[];
}

const requiredCertifications = [
  "ISO 9001 Quality Management",
  "ISO 27001 Information Security",
  "Local Business Registration",
  "Tax Compliance Certificate",
  "Insurance Coverage",
];

export default function SubmitBidPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tenderId = params.id as string;

  const tender = mockTenders.find((t) => t.id === tenderId);

  const [formData, setFormData] = useState<BidFormData>({
    amount: "",
    technicalProposal: "",
    deliveryTimeline: "",
    warranty: "",
    documents: [],
    certifications: [],
    digitalSignature: "",
    linkedProducts: [],
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<string>("");

  if (user?.role !== "vendor" || !tender || tender.status !== "published") {
    router.push("/tenders");
    return null;
  }

  const handleCertificationChange = (
    certification: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      certifications: checked
        ? [...prev.certifications, certification]
        : prev.certifications.filter((c) => c !== certification),
    }));
  };

  const generateDigitalSignature = async () => {
    setIsGeneratingSignature(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const signature = `DS_${user?.name
      ?.replace(/\s+/g, "")
      .toUpperCase()}_${Date.now()}`;
    setFormData((prev) => ({ ...prev, digitalSignature: signature }));
    setIsGeneratingSignature(false);
  };

  const handleLinkProduct = () => {
    const product = mockProducts.find((p) => p.id === selectedProduct);
    if (!product || !productQuantity || Number(productQuantity) <= 0) return;

    const quantity = Number(productQuantity);
    const totalValue = product.price * quantity;

    const linkedProduct: LinkedProduct = {
      productId: product.id,
      productName: product.name,
      lockedPrice: product.price,
      lockTimestamp: new Date().toISOString(),
      quantity,
      totalValue,
      priceVerificationHash:
        product.priceHistory[product.priceHistory.length - 1]?.blockchainHash ||
        "0x000",
      productBlockchainHash:
        product.blockchainVerifications[0]?.blockHash || "0x000",
    };

    setFormData((prev) => ({
      ...prev,
      linkedProducts: [...prev.linkedProducts, linkedProduct],
      amount: (Number(prev.amount || 0) + totalValue).toString(),
    }));

    setSelectedProduct("");
    setProductQuantity("");
    setIsProductDialogOpen(false);
  };

  const handleRemoveProduct = (productId: string) => {
    const productToRemove = formData.linkedProducts.find(
      (p) => p.productId === productId
    );
    if (productToRemove) {
      setFormData((prev) => ({
        ...prev,
        linkedProducts: prev.linkedProducts.filter(
          (p) => p.productId !== productId
        ),
        amount: (
          Number(prev.amount || 0) - productToRemove.totalValue
        ).toString(),
      }));
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (
      !formData.amount ||
      isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      errors.push("Valid bid amount is required");
    }
    if (tender && Number(formData.amount) > tender.budget * 1.2) {
      errors.push("Bid amount cannot exceed 120% of tender budget");
    }
    if (!formData.technicalProposal.trim()) {
      errors.push("Technical proposal is required");
    }
    if (!formData.deliveryTimeline.trim()) {
      errors.push("Delivery timeline is required");
    }
    if (formData.certifications.length < 3) {
      errors.push("At least 3 certifications are required");
    }
    if (!formData.digitalSignature) {
      errors.push("Digital signature is required");
    }
    if (!acceptedTerms) {
      errors.push("You must accept the terms and conditions");
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const internalBlockchainHash = `0x${Math.random()
      .toString(16)
      .substr(2, 40)}`;
    const publicBlockchainHash = `0x${Math.random()
      .toString(16)
      .substr(2, 32)}`;

    console.log("Submitting bid with blockchain verification:", {
      tenderId,
      vendorId: user?.id,
      ...formData,
      internalBlockchainHash,
      publicBlockchainHash,
      linkedProducts: formData.linkedProducts,
    });

    setIsSubmitting(false);
    router.push("/bids");
  };

  if (!tender) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/tenders/${tender.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tender
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-balance">Submit Bid</h1>
              <p className="text-muted-foreground">{tender.title}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Information</CardTitle>
                  <CardDescription>
                    Provide your competitive bid details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Bid Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Tender budget: ${tender.budget.toLocaleString()} (max bid:
                      ${(tender.budget * 1.2).toLocaleString()})
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technicalProposal">
                      Technical Proposal
                    </Label>
                    <Textarea
                      id="technicalProposal"
                      placeholder="Describe your technical approach, methodology, and solution details"
                      rows={6}
                      value={formData.technicalProposal}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          technicalProposal: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTimeline">
                        Delivery Timeline
                      </Label>
                      <Input
                        id="deliveryTimeline"
                        placeholder="e.g., 6 months from contract signing"
                        value={formData.deliveryTimeline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            deliveryTimeline: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty Period</Label>
                      <Input
                        id="warranty"
                        placeholder="e.g., 2 years comprehensive warranty"
                        value={formData.warranty}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            warranty: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Compliance</CardTitle>
                  <CardDescription>
                    Select all applicable certifications you possess
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {requiredCertifications.map((certification) => (
                    <div
                      key={certification}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={certification}
                        checked={formData.certifications.includes(
                          certification
                        )}
                        onCheckedChange={(checked) =>
                          handleCertificationChange(
                            certification,
                            checked as boolean
                          )
                        }
                      />
                      <label
                        htmlFor={certification}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {certification}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Linked Products</CardTitle>
                  <CardDescription>
                    Link marketplace products to lock in current prices and
                    prevent manipulation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.linkedProducts.length > 0 && (
                    <div className="space-y-3">
                      {formData.linkedProducts.map((product) => (
                        <div
                          key={product.productId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {product.productName}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Price Locked
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              ${product.lockedPrice.toLocaleString()} ×{" "}
                              {product.quantity} = $
                              {product.totalValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Locked:{" "}
                              {new Date(product.lockTimestamp).toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveProduct(product.productId)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Dialog
                    open={isProductDialogOpen}
                    onOpenChange={setIsProductDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <GLink className="mr-2 h-4 w-4" />
                        Link Marketplace Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Link Marketplace Product</DialogTitle>
                        <DialogDescription>
                          Select a product from the marketplace to lock in the
                          current price
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Product</Label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                          >
                            <option value="">Choose a product...</option>
                            {mockProducts.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} - $
                                {product.price.toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedProduct && (
                          <div className="p-3 bg-muted rounded-lg">
                            {(() => {
                              const product = mockProducts.find(
                                (p) => p.id === selectedProduct
                              );
                              return product ? (
                                <div>
                                  <h4 className="font-medium">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {product.description}
                                  </p>
                                  <div className="mt-2 flex items-center gap-4">
                                    <Badge variant="outline">
                                      Current Price: $
                                      {product.price.toLocaleString()}
                                    </Badge>
                                    <Badge variant="outline">
                                      Vendor: {product.vendorName}
                                    </Badge>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="Enter quantity"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleLinkProduct}
                            disabled={!selectedProduct || !productQuantity}
                          >
                            Link Product
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>
                    Upload relevant documents to support your bid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">Upload Documents</Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Technical specifications, company profile, certificates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Digital Signature & Blockchain Verification
                  </CardTitle>
                  <CardDescription>
                    Generate a secure digital signature for your bid with
                    blockchain storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!formData.digitalSignature ? (
                    <Button
                      onClick={generateDigitalSignature}
                      disabled={isGeneratingSignature}
                      className="w-full"
                    >
                      {isGeneratingSignature
                        ? "Generating Signature..."
                        : "Generate Digital Signature"}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Digital signature generated
                        </span>
                      </div>
                      <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                        {formData.digitalSignature}
                      </p>

                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          <span>
                            Bid will be stored on internal blockchain with
                            public hash verification
                          </span>
                        </div>
                        <div className="pl-5">
                          <p>• Full bid data: Internal blockchain network</p>
                          <p>• Verification hash: Public blockchain network</p>
                          <p>
                            • Linked product prices: Immutable at submission
                            time
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={setAcceptedTerms}
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed">
                      I acknowledge that I have read and agree to the tender
                      terms and conditions, and that all information provided in
                      this bid is accurate and complete. I understand that this
                      bid is legally binding upon acceptance.
                    </label>
                  </div>
                </CardContent>
              </Card>

              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting Bid to Blockchain..."
                  : "Submit Bid"}
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">
                      ${tender.budget.toLocaleString()}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Closing Date
                    </p>
                    <p className="font-semibold">
                      {new Date(tender.closingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-semibold">{tender.category}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground">Competition</p>
                    <p className="font-semibold">
                      {tender.bidCount} bids submitted
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bid Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Ensure all required certifications are selected
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Provide detailed technical proposal
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Upload supporting documents</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Generate digital signature</p>
                  </div>
                </CardContent>
              </Card>

              {formData.linkedProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Linked Products Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.linkedProducts.map((product) => (
                      <div key={product.productId} className="text-sm">
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-muted-foreground">
                          {product.quantity} × $
                          {product.lockedPrice.toLocaleString()} = $
                          {product.totalValue.toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <Separator />
                    <div className="font-medium">
                      Total Linked: $
                      {formData.linkedProducts
                        .reduce((sum, p) => sum + p.totalValue, 0)
                        .toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
