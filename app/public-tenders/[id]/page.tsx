"use client";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Shield,
  ExternalLink,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockTenders } from "@/lib/mock-data";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicTenderDetailPage() {
  const params = useParams();
  const tenderId = params.id as string;

  const tender = mockTenders.find((t) => t.id === tenderId);

  if (!tender || tender.status !== "published") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tender Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            This tender may not be published or does not exist.
          </p>
          <Link href="/public-tenders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Public Tenders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img
                    src="https://storage-auctra.monzim.com/auctra-logo.webp"
                    alt=""
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Auctra
                  </h1>
                  <p className="text-xs text-gray-500">
                    Public Procurement Portal
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Login to Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/public-tenders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Public Tenders
            </Button>
          </Link>
        </div>

        {/* Tender Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {tender.title}
                </CardTitle>
                <p className="text-gray-600 mb-4">{tender.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Published:{" "}
                      {new Date(tender.publishedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Deadline: {new Date(tender.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(tender.status)}>
                {tender.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Key Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tender Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold">
                    ${tender.budget.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{tender.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{tender.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Verification Status</p>
                  <p className="font-semibold text-green-600">Verified</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Blockchain Hash</p>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                  {tender.blockchainHash}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Block Number</p>
                <p className="font-semibold">
                  #{Math.floor(Math.random() * 1000000)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detailed Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {tender.description}
              </p>
              <h4 className="font-semibold text-gray-900 mb-2">
                Project Scope
              </h4>
              <p className="text-gray-700 mb-4">
                This procurement opportunity involves comprehensive{" "}
                {tender.category.toLowerCase()} services with a focus on quality
                delivery and adherence to government standards. The selected
                vendor will be responsible for all aspects of project execution
                within the specified timeline.
              </p>
              <h4 className="font-semibold text-gray-900 mb-2">
                Key Requirements
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Proven track record in {tender.category.toLowerCase()}</li>
                <li>Compliance with all relevant government regulations</li>
                <li>Quality assurance and project management capabilities</li>
                <li>Timely delivery within budget constraints</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tender Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Tender Specification Document</p>
                    <p className="text-sm text-gray-600">PDF • 2.4 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Terms and Conditions</p>
                    <p className="text-sm text-gray-600">PDF • 1.8 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interested in Bidding?
            </h3>
            <p className="text-gray-600 mb-4">
              To submit a bid for this tender, you need to register and login to
              the Auctra portal.
            </p>
            <Link href="/login">
              <Button size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                Login to Submit Bid
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
