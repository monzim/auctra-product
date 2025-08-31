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
import { mockPriceTrends } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Target,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const priceAlerts = [
  {
    id: "1",
    category: "IT Hardware",
    product: "Enterprise Servers",
    currentPrice: 26000,
    previousPrice: 24000,
    change: 8.3,
    trend: "up",
    alert: "Price increase detected",
  },
  {
    id: "2",
    category: "Construction Equipment",
    product: "Road Paving Equipment",
    currentPrice: 435000,
    previousPrice: 460000,
    change: -5.4,
    trend: "down",
    alert: "Favorable pricing opportunity",
  },
  {
    id: "3",
    category: "Medical Equipment",
    product: "MRI Machines",
    currentPrice: 175000,
    previousPrice: 190000,
    change: -7.9,
    trend: "down",
    alert: "Significant price drop",
  },
];

const marketInsights = [
  {
    category: "IT Hardware",
    avgPrice: 25400,
    marketTrend: "stable",
    competitiveness: "high",
    recommendation: "Good time to procure",
  },
  {
    category: "Construction Equipment",
    avgPrice: 442000,
    marketTrend: "declining",
    competitiveness: "medium",
    recommendation: "Wait for further decline",
  },
  {
    category: "Medical Equipment",
    avgPrice: 182000,
    marketTrend: "volatile",
    competitiveness: "low",
    recommendation: "Monitor closely",
  },
];

export default function PriceIntelligencePage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("6months");

  const categories = [
    "IT Hardware",
    "Construction Equipment",
    "Medical Equipment",
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Price Intelligence
            </h1>
            <p className="text-muted-foreground">
              Real-time market pricing insights and trend analysis for informed
              procurement decisions
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Market Price
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$216K</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Price Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{priceAlerts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active notifications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Market Volatility
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Medium</div>
                <p className="text-xs text-muted-foreground">
                  Stable conditions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Savings Opportunity
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.3M</div>
                <p className="text-xs text-muted-foreground">
                  Potential savings
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Price Trends</TabsTrigger>
              <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
              <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Price Trend Analysis</CardTitle>
                      <CardDescription>
                        Historical pricing data across categories
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
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

                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3months">3 Months</SelectItem>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockPriceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `$${Number(value).toLocaleString()}`,
                            "Price",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="servers"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          name="IT Hardware"
                          dot={{
                            fill: "hsl(var(--chart-1))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="construction"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={3}
                          name="Construction"
                          dot={{
                            fill: "hsl(var(--chart-2))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="medical"
                          stroke="hsl(var(--chart-3))"
                          strokeWidth={3}
                          name="Medical"
                          dot={{
                            fill: "hsl(var(--chart-3))",
                            strokeWidth: 2,
                            r: 4,
                          }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Price Alerts</CardTitle>
                  <CardDescription>
                    Significant price changes and market opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {priceAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              alert.trend === "up"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {alert.trend === "up" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{alert.product}</h3>
                            <p className="text-sm text-muted-foreground">
                              {alert.category}
                            </p>
                            <p className="text-sm">{alert.alert}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              ${alert.currentPrice.toLocaleString()}
                            </span>
                            <Badge
                              variant={
                                alert.trend === "up" ? "destructive" : "default"
                              }
                            >
                              {alert.change > 0 ? "+" : ""}
                              {alert.change.toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Previous: ${alert.previousPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {marketInsights.map((insight, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {insight.category}
                      </CardTitle>
                      <CardDescription>
                        Market analysis and recommendations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Average Price
                          </span>
                          <span className="font-semibold">
                            ${insight.avgPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Market Trend
                          </span>
                          <Badge
                            variant={
                              insight.marketTrend === "stable"
                                ? "secondary"
                                : insight.marketTrend === "declining"
                                ? "default"
                                : "outline"
                            }
                          >
                            {insight.marketTrend}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Competitiveness
                          </span>
                          <Badge
                            variant={
                              insight.competitiveness === "high"
                                ? "destructive"
                                : insight.competitiveness === "medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {insight.competitiveness}
                          </Badge>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-primary">
                          {insight.recommendation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison by Category</CardTitle>
                  <CardDescription>
                    Compare average prices across different product categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marketInsights}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `$${Number(value).toLocaleString()}`,
                            "Average Price",
                          ]}
                        />
                        <Bar dataKey="avgPrice" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Distribution</CardTitle>
                    <CardDescription>
                      Current market price ranges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.map((category, index) => {
                        const insight = marketInsights[index];
                        const minPrice = insight.avgPrice * 0.8;
                        const maxPrice = insight.avgPrice * 1.2;
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                {category}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ${minPrice.toLocaleString()} - $
                                {maxPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${60 + index * 15}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Procurement Recommendations</CardTitle>
                    <CardDescription>
                      AI-powered procurement insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Optimal Timing</p>
                          <p className="text-xs text-muted-foreground">
                            Construction equipment prices expected to drop 3-5%
                            next quarter
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Price Volatility
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Medical equipment showing high volatility - consider
                            fixed-price contracts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Market Opportunity
                          </p>
                          <p className="text-xs text-muted-foreground">
                            IT hardware prices stable - good time for bulk
                            procurement
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
