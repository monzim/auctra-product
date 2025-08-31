"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertCircle, Upload, Plus, X } from "lucide-react"
import Link from "next/link"

interface TenderFormData {
  title: string
  description: string
  category: string
  budget: string
  closingDate: string
  requirements: string[]
  documents: string[]
}

const categories = [
  "Information Technology",
  "Construction",
  "Healthcare",
  "Transportation",
  "Education",
  "Energy",
  "Professional Services",
]

const complianceChecks = [
  { id: "budget_approval", label: "Budget approval obtained", required: true },
  { id: "legal_review", label: "Legal review completed", required: true },
  { id: "technical_specs", label: "Technical specifications validated", required: true },
  { id: "procurement_policy", label: "Complies with procurement policy", required: true },
  { id: "environmental_impact", label: "Environmental impact assessed", required: false },
  { id: "accessibility", label: "Accessibility requirements included", required: false },
]

export default function CreateTenderPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<TenderFormData>({
    title: "",
    description: "",
    category: "",
    budget: "",
    closingDate: "",
    requirements: [""],
    documents: [],
  })
  const [complianceStatus, setComplianceStatus] = useState<Record<string, boolean>>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentRequirement, setCurrentRequirement] = useState("")

  // Redirect if not procuring officer
  if (user?.role !== "procuring_officer") {
    router.push("/dashboard")
    return null
  }

  const handleComplianceChange = (checkId: string, checked: boolean) => {
    setComplianceStatus((prev) => ({ ...prev, [checkId]: checked }))
  }

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements.filter((r) => r), currentRequirement.trim()],
      }))
      setCurrentRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.title.trim()) errors.push("Title is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (!formData.category) errors.push("Category is required")
    if (!formData.budget || isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      errors.push("Valid budget amount is required")
    }
    if (!formData.closingDate) errors.push("Closing date is required")
    if (new Date(formData.closingDate) <= new Date()) {
      errors.push("Closing date must be in the future")
    }

    // Check required compliance items
    const requiredCompliance = complianceChecks.filter((check) => check.required)
    const missingCompliance = requiredCompliance.filter((check) => !complianceStatus[check.id])
    if (missingCompliance.length > 0) {
      errors.push(`Required compliance checks missing: ${missingCompliance.map((c) => c.label).join(", ")}`)
    }

    return errors
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft) {
      const errors = validateForm()
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }
    }

    setIsSubmitting(true)
    setValidationErrors([])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock success - in real app, this would create the tender
    console.log("Creating tender:", { ...formData, status: isDraft ? "draft" : "published" })

    setIsSubmitting(false)
    router.push("/tenders")
  }

  const complianceScore = (Object.values(complianceStatus).filter(Boolean).length / complianceChecks.length) * 100

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/tenders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tenders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-balance">Create New Tender</h1>
              <p className="text-muted-foreground">Set up a new procurement tender with compliance validation</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide the essential details for your tender</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tender Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter tender title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed description of the procurement requirements"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (USD)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="0"
                        value={formData.budget}
                        onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closingDate">Closing Date</Label>
                    <Input
                      id="closingDate"
                      type="date"
                      value={formData.closingDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, closingDate: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>Specify the requirements vendors must meet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a requirement"
                      value={currentRequirement}
                      onChange={(e) => setCurrentRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addRequirement()}
                    />
                    <Button onClick={addRequirement} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.requirements
                      .filter((r) => r)
                      .map((requirement, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <span className="flex-1 text-sm">{requirement}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Upload tender documents and specifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">Upload Documents</Button>
                      <p className="text-sm text-muted-foreground mt-2">PDF, DOC, DOCX files up to 10MB each</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Compliance Check
                    <Badge variant={complianceScore === 100 ? "default" : "secondary"}>
                      {Math.round(complianceScore)}%
                    </Badge>
                  </CardTitle>
                  <CardDescription>Ensure all requirements are met before publishing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {complianceChecks.map((check) => (
                    <div key={check.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={check.id}
                        checked={complianceStatus[check.id] || false}
                        onCheckedChange={(checked) => handleComplianceChange(check.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={check.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {check.label}
                          {check.required && <span className="text-destructive ml-1">*</span>}
                        </label>
                      </div>
                    </div>
                  ))}
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

              <div className="space-y-2">
                <Button onClick={() => handleSubmit(false)} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Publish Tender"}
                </Button>
                <Button onClick={() => handleSubmit(true)} variant="outline" className="w-full" disabled={isSubmitting}>
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
