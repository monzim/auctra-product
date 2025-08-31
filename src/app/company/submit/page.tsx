'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, FormEvent } from "react";

// Define the structure for a form error
interface FormErrors {
    companyId?: string;
    name?: string;
    registrationNumber?: string;
    contact?: string;
    documents?: string;
}

export default function CompanySubmissionPage() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateFile = (file: File | null): string | null => {
        if (!file) {
            return "A document is required.";
        }
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
            return "Invalid file type. Only PDF, JPG, and PNG are allowed.";
        }
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSizeInBytes) {
            return `File is too large. Maximum size is ${maxSizeInBytes / (1024*1024)} MB.`;
        }
        return null;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setErrors({});
        setSuccessMessage('');
        setGeneralError('');

        const formData = new FormData(event.currentTarget);
        const fileInput = event.currentTarget.elements.namedItem("documents") as HTMLInputElement;
        const file = fileInput.files ? fileInput.files[0] : null;

        // Client-side validation
        const newErrors: FormErrors = {};
        if (!formData.get('companyId')) newErrors.companyId = "Company ID is required.";
        if (!formData.get('name')) newErrors.name = "Company Name is required.";
        if (!formData.get('registrationNumber')) newErrors.registrationNumber = "Registration Number is required.";
        if (!formData.get('contact')) newErrors.contact = "Contact information is required.";

        const fileError = validateFile(file);
        if (fileError) {
            newErrors.documents = fileError;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        if (file) {
            formData.append("documents", file);
        }

        try {
            const response = await fetch('/api/company/submit', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setGeneralError(result.message || "An unknown error occurred.");
            } else {
                setSuccessMessage("Submission successful! Your application is pending review.");
                (event.target as HTMLFormElement).reset();
            }
        } catch (error) {
            setGeneralError("Failed to connect to the server. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Company Registration</CardTitle>
                    <CardDescription>Submit your company details for verification. All fields are required.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="companyId">Company ID</Label>
                            <Input id="companyId" name="companyId" placeholder="e.g., COMP-12345" />
                            {errors.companyId && <p className="text-red-500 text-sm">{errors.companyId}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Acme Corporation" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="registrationNumber">Registration Number</Label>
                            <Input id="registrationNumber" name="registrationNumber" placeholder="e.g., 987654321" />
                            {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="contact">Contact Details</Label>
                            <Textarea id="contact" name="contact" placeholder="e.g., contact@acme.com, +1234567890" />
                            {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documents">Supporting Document (PDF, JPG, PNG, max 10MB)</Label>
                            <Input id="documents" name="documents" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                            {errors.documents && <p className="text-red-500 text-sm">{errors.documents}</p>}
                        </div>

                        {successMessage && <p className="text-green-500">{successMessage}</p>}
                        {generalError && <p className="text-red-500">{generalError}</p>}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit for Verification"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
