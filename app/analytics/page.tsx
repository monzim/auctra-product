"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAnalytics } from "@/lib/mock-data";
import {
  Search,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const auditLogs = [
  {
    id: "1",
    timestamp: "2024-02-15 14:30:22",
    user: "Sarah Johnson",
    action: "Tender Published",
    details: "IT Infrastructure Modernization tender published",
    category: "Tender Management",
    severity: "info",
  },
  {
    id: "2",
    timestamp: "2024-02-15 13:45:18",
    user: "TechCorp Solutions",
    action: "Bid Submitted",
    details: "Bid submitted for IT Infrastructure tender ($2,350,000)",
    category: "Bid Management",
    severity: "info",
  },
  {
    id: "3",
    timestamp: "2024-02-15 12:20:45",
    user: "System",
    action: "Price Alert Triggered",
    details: "Server prices increased by 8.3% - alert threshold exceeded",
    category: "Price Intelligence",
    severity: "warning",
  },
  {
    id: "4",
    timestamp: "2024-02-15 11:15:33",
    user: "Sarah Johnson",
    action: "Contract Awarded",
    details: "Highway construction contract awarded to BuildRight Construction",
    category: "Contract Management",
    severity: "success",
  },
  {
    id: "5",
    timestamp: "2024-02-15 10:30:12",
    user: "BuildRight Construction",
    action: "Milestone Completed",
    details: "Foundation & Base Layer milestone marked as completed",
    category: "Project Execution",
    severity: "success",
  },
  {
    id: "6",
    timestamp: "2024-02-15 09:45:28",
    user: "System",
    action: "Anomaly Detected",
    details: "Unusual bidding pattern detected in medical equipment category",
    category: "Fraud Detection",
    severity: "critical",
  },
];

const tenderCategoryData = [
  { name: "IT", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Construction", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Healthcare", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Transportation", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
];

const monthlyTenderData = [
  { month: "Jan", tenders: 12, bids: 98, value: 15.2 },
  { month: "Feb", tenders: 18, bids: 142, value: 22.8 },
  { month: "Mar", tenders: 15, bids: 125, value: 18.5 },
  { month: "Apr", tenders: 22, bids: 178, value: 28.3 },
  { month: "May", tenders: 19, bids: 156, value: 24.1 },
  { month: "Jun", tenders: 16, bids: 134, value: 19.7 },
];

const severityColors = {
  info: "secondary",
  success: "default",
  warning: "outline",
  critical: "destructive",
} as const;

const severityIcons = {
  info: Eye,
  success: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle,
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("7days");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || log.category === categoryFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const categories = Array.from(new Set(auditLogs.map((log) => log.category)));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Analytics & Oversight
              </h1>
              <p className="text-muted-foreground">
                Comprehensive analytics, audit trails, and procurement insights
              </p>
            </div>
            <Button variant="outline" className="bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Tenders
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockAnalytics.totalTenders}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Bids
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockAnalytics.totalBids}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Avg {mockAnalytics.averageBidsPerTender} per tender
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Value
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${(mockAnalytics.totalValue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Procurement volume
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cost Savings
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockAnalytics.costSavings}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Below budget average
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Tender Distribution by Category</CardTitle>
                    <CardDescription>
                      Breakdown of procurement categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tenderCategoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {tenderCategoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tenderCategoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Tender Activity</CardTitle>
                    <CardDescription>
                      Tender and bid volume over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyTenderData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="tenders"
                            fill="hsl(var(--chart-1))"
                            name="Tenders"
                          />
                          <Bar
                            dataKey="bids"
                            fill="hsl(var(--chart-2))"
                            name="Bids"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>On-Time Delivery</CardTitle>
                    <CardDescription>
                      Project completion performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">
                        {mockAnalytics.onTimeDelivery}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Projects delivered on time
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completed Projects</CardTitle>
                    <CardDescription>
                      Successfully finished projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">
                        {mockAnalytics.completedProjects}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total completed
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Savings</CardTitle>
                    <CardDescription>Cost efficiency metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600">
                        {mockAnalytics.costSavings}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Below budget
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>
                    Key performance indicators over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tender Processing Time</span>
                        <span>14 days avg</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: "85%" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Vendor Participation Rate</span>
                        <span>8.2 bids/tender</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Contract Compliance</span>
                        <span>96.5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: "96%" }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    Complete system activity log with filtering capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search audit logs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
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

                    <Select
                      value={severityFilter}
                      onValueChange={setSeverityFilter}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1day">Last Day</SelectItem>
                        <SelectItem value="7days">Last Week</SelectItem>
                        <SelectItem value="30days">Last Month</SelectItem>
                        <SelectItem value="90days">Last Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Audit Log Entries */}
                  <div className="space-y-2">
                    {filteredLogs.map((log) => {
                      const SeverityIcon = severityIcons[log.severity];
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 border rounded-lg"
                        >
                          <SeverityIcon
                            className={`h-4 w-4 mt-0.5 ${
                              log.severity === "critical"
                                ? "text-red-600"
                                : log.severity === "warning"
                                ? "text-yellow-600"
                                : log.severity === "success"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{log.action}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={severityColors[log.severity]}>
                                  {log.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {log.timestamp}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {log.details}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>User: {log.user}</span>
                              <span>Category: {log.category}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No audit logs found matching your criteria.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                    <CardDescription>
                      Automated analysis and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Procurement Efficiency
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your procurement process is 23% faster than industry
                            average
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Vendor Concentration Risk
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Consider diversifying suppliers in IT category (65%
                            concentration)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Compliance Score
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Excellent compliance rate of 96.5% across all
                            contracts
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Anomaly Detection</CardTitle>
                    <CardDescription>
                      Automated fraud and irregularity detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              Unusual Bidding Pattern
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Detected coordinated bidding in medical equipment
                              category - requires investigation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              Price Spike Alert
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Server hardware prices increased 15% above
                              historical average
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">
                              Clean Activity
                            </p>
                            <p className="text-xs text-muted-foreground">
                              No suspicious patterns detected in construction
                              and transportation categories
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>
                    Actionable insights to improve procurement efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">
                          Optimize Tender Duration
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Reduce average tender duration from 21 to 14 days for
                          IT category to increase vendor participation.
                        </p>
                        <Button size="sm" variant="outline">
                          Apply Recommendation
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Expand Vendor Pool</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Invite 12 additional pre-qualified vendors to
                          healthcare tenders to improve competition.
                        </p>
                        <Button size="sm" variant="outline">
                          View Vendors
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Price Benchmarking</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Enable automatic price comparison with market rates
                          for construction materials.
                        </p>
                        <Button size="sm" variant="outline">
                          Enable Feature
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Contract Templates</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Standardize contract terms for IT services to reduce
                          processing time by 30%.
                        </p>
                        <Button size="sm" variant="outline">
                          Create Templates
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
