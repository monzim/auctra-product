import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Zap,
  Eye,
  Users,
  BarChart,
  CheckCircle,
  FileText,
  Calculator,
  HardDrive,
  Send,
  Lock,
  BookOpen,
  TrendingUp,
  Award,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🚀 Blockchain-Powered Procurement
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
                  Revolutionize <span className="text-primary">Government</span>{" "}
                  Procurement
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                  Auctra brings unparalleled transparency, efficiency, and trust
                  to public tenders through cutting-edge blockchain technology.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/public-tenders">
                    Explore Public Tenders{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Fully Transparent</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="https://storage-auctra.monzim.com/auctra-logo.webp"
                  alt="Professional procurement officer using Auctra platform"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-lg blur-3xl -z-10 transform scale-105"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      {/* <section className="py-12 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by Government Agencies Worldwide
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "U.S. General Services Administration",
              "European Commission",
              "Government of Canada",
              "Australian Government",
              "UK Crown Commercial Service",
            ].map((org, index) => (
              <div
                key={index}
                className="text-sm font-medium text-muted-foreground"
              >
                {org}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Key Benefits */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              Why Choose Auctra?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Transform your procurement process with blockchain technology that
              ensures transparency, security, and efficiency at every step.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Unmatched Security",
                description:
                  "Blockchain-powered protection for all transactions and bids with immutable records.",
              },
              {
                icon: Zap,
                title: "Lightning-Fast Efficiency",
                description:
                  "Streamlined processes that accelerate the entire procurement cycle by 60%.",
              },
              {
                icon: Eye,
                title: "Total Transparency",
                description:
                  "Real-time visibility into every step of the tendering process for all stakeholders.",
              },
              {
                icon: Users,
                title: "Fair Competition",
                description:
                  "Level playing field for all contractors, promoting healthy market dynamics.",
              },
              {
                icon: BarChart,
                title: "Data-Driven Insights",
                description:
                  "Leverage powerful analytics to optimize government spending and detect anomalies.",
              },
              {
                icon: Award,
                title: "Compliance Assured",
                description:
                  "Built-in compliance checks ensure all regulations and standards are met automatically.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              How Auctra Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A simple, secure, and transparent process that revolutionizes
              government procurement.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: FileText,
                title: "Register Tender",
                description:
                  "Government agencies register new tenders on the blockchain platform with all requirements.",
              },
              {
                step: 2,
                icon: Calculator,
                title: "Create Budget",
                description:
                  "Contractors use the real-time marketplace catalog to create accurate, transparent budgets.",
              },
              {
                step: 3,
                icon: Send,
                title: "Submit Bids",
                description:
                  "Secure bid submission with digital signatures and blockchain verification for integrity.",
              },
              {
                step: 4,
                icon: HardDrive,
                title: "Blockchain Record",
                description:
                  "All data is immutably recorded on blockchain, ensuring transparency and preventing manipulation.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-y-0.5"></div>
                  )}
                </div>
                <item.icon className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-pretty">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline">Advanced Features</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                  Built for Modern Government Procurement
                </h2>
                <p className="text-xl text-muted-foreground text-pretty">
                  Auctra combines cutting-edge blockchain technology with
                  intuitive design to create the most advanced procurement
                  platform available.
                </p>
              </div>
              <div className="grid gap-6">
                {[
                  {
                    icon: Lock,
                    title: "Blockchain Security",
                    description:
                      "Immutable records with dual-chain architecture for maximum security.",
                  },
                  {
                    icon: BookOpen,
                    title: "Real-time Marketplace",
                    description:
                      "Live pricing data with IoT integration and automated updates.",
                  },
                  {
                    icon: TrendingUp,
                    title: "AI-Powered Analytics",
                    description:
                      "Smart insights, anomaly detection, and predictive procurement analytics.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Live Tender Dashboard</h3>
                    <Badge variant="secondary">Real-time</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Active Tenders</span>
                      <span className="font-semibold text-primary">247</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Total Bids</span>
                      <span className="font-semibold text-secondary">
                        1,432
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Blockchain Verified</span>
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Video Sections */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              See Auctra in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch our comprehensive demos to understand how Auctra transforms
              government procurement.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Auctra Pitch Deck</h3>
                <p className="text-muted-foreground">
                  Learn about our vision and the technology behind Auctra's
                  blockchain procurement platform.
                </p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/wE3Hw-uF2Zc"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Auctra Prototype</h3>
                <p className="text-muted-foreground">
                  See our working prototype in action and explore the user
                  interface and key features.
                </p>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/htVa43BajJY"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Ready to Transform Public Procurement?
            </h2>
            <p className="text-xl opacity-90 text-pretty">
              Join government agencies worldwide who are already using Auctra to
              create more transparent, efficient, and secure procurement
              processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/public-tenders">
                  Explore Public Tenders <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/login">Get Started Today</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Global Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Mobile Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
