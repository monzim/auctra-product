import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Ban,
  BarChart,
  BookOpen,
  Calculator,
  CheckCircle,
  Database,
  Eye,
  FileText,
  HardDrive,
  LineChart,
  Lock,
  Scale,
  Send,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0 rounded-md"></div>
        <div className="container mx-auto px-4 relative z-10 rounded-md">
          <div className="text-center space-y-8 max-w-3xl mx-auto rounded-md">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
              Revolutionize{" "}
              <span className="text-primary">Government Procurement</span>
            </h1>
            <p className="text-md md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Auctra brings unparalleled transparency, efficiency, and trust to
              public tenders through cutting-edge blockchain technology.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/catalog">
                  Explore Catalog <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/bids">View Bids</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Auctra Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Auctra?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Unmatched Security",
              description:
                "Blockchain-powered protection for all transactions and bids.",
            },
            {
              icon: Zap,
              title: "Lightning-Fast Efficiency",
              description:
                "Streamlined processes that accelerate the entire procurement cycle.",
            },
            {
              icon: TrendingUp,
              title: "Total Transparency",
              description:
                "Real-time visibility into every step of the tendering process.",
            },
            {
              icon: CheckCircle,
              title: "Fair Competition",
              description:
                "Level playing field for all contractors, promoting healthy market dynamics.",
            },
            {
              icon: Users,
              title: "Stakeholder Trust",
              description:
                "Build public confidence with a fully auditable procurement system.",
            },
            {
              icon: BarChart,
              title: "Data-Driven Decisions",
              description:
                "Leverage powerful analytics to optimize government spending.",
            },
          ].map((feature, index) => (
            <Card key={index} className="border-none shadow-none">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    {
                      icon: FileText,
                      text: "New tenders are registered on the platform",
                    },
                    {
                      icon: Calculator,
                      text: "Contractors create budgets using our up-to-date product catalog",
                    },
                    {
                      icon: HardDrive,
                      text: "Daily product prices are stored on the blockchain",
                    },
                    {
                      icon: Shield,
                      text: "Bid information is securely recorded on the blockchain",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <item.icon className="h-6 w-6 text-primary mr-2" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    {
                      icon: Ban,
                      text: "Prevents artificial inflation of budgets",
                    },
                    {
                      icon: Scale,
                      text: "Ensures fair pricing based on current market rates",
                    },
                    {
                      icon: Database,
                      text: "Creates an auditable trail of all pricing and bidding activities",
                    },
                    {
                      icon: Users,
                      text: "Increases trust in the government procurement process",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <item.icon className="h-6 w-6 text-primary mr-2" />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The Auctra Process Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          The Auctra Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              icon: FileText,
              title: "Register Tender",
              description:
                "Government agencies register new tenders on the platform",
            },
            {
              step: 2,
              icon: Calculator,
              title: "Create Budget",
              description:
                "Contractors use the up-to-date catalog to create accurate budgets",
            },
            {
              step: 3,
              icon: Send,
              title: "Submit Bids",
              description:
                "Contractors submit their bids based on the created budgets",
            },
            {
              step: 4,
              icon: HardDrive,
              title: "Blockchain Record",
              description:
                "All prices and bids are securely recorded on the blockchain",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                {item.step}
              </div>
              <item.icon className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-background to-primary/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Secure",
                description:
                  "Blockchain-powered security for all price records and bids",
              },
              {
                icon: BookOpen,
                title: "Up-to-date Catalog",
                description:
                  "Daily updated product prices for accurate budgeting",
              },
              {
                icon: Eye,
                title: "Transparent",
                description:
                  "Full visibility into the tendering and budgeting process",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-none shadow-none bg-background/60 backdrop-blur-sm"
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages of Auctra Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Advantages of Auctra
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: Ban,
              title: "Prevent Manipulations",
              description:
                "Daily price records on the blockchain prevent artificial budget inflation.",
            },
            {
              icon: Scale,
              title: "Fair Competition",
              description:
                "All contractors work with the same up-to-date pricing information.",
            },
            {
              icon: Database,
              title: "Immutable Records",
              description:
                "Blockchain technology ensures that all price and bid data cannot be altered.",
            },
            {
              icon: LineChart,
              title: "Transparent Budgeting",
              description:
                "Clear visibility into how tender budgets are created and justified.",
            },
          ].map((advantage, index) => (
            <Card key={index} className="border-none shadow-none">
              <CardHeader>
                <advantage.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{advantage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{advantage.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/*  */}
      <section className="space-y-6">
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-center mb-8">
            <span className="block text-3xl font-extrabold">
              Auctra Pitch Deck
            </span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <iframe
              src="https://www.youtube.com/embed/wE3Hw-uF2Zc"
              className="w-full h-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-center mb-8">
            <span className="block text-3xl font-extrabold">
              Auctra Prototype
            </span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <iframe
              src="https://www.youtube.com/embed/htVa43BajJY"
              className="w-full h-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Public Procurement?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join Auctra today and be part of the revolution in government
            tendering processes.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/catalog">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
