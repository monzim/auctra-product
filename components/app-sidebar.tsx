"use client";

import { useAuth } from "@/components/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  FileText,
  Gavel,
  FileCheck,
  Truck,
  Store,
  TrendingUp,
  BarChart3,
  Shield,
  LogOut,
  ChevronUp,
  Eye,
  Building2,
  HelpCircle,
  Phone,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const procuringOfficerItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tender Management",
    url: "/tenders",
    icon: FileText,
  },
  {
    title: "Bid Evaluation",
    url: "/bids/evaluation",
    icon: Gavel,
  },
  {
    title: "Contracts",
    url: "/contracts",
    icon: FileCheck,
  },
  {
    title: "Project Execution",
    url: "/projects",
    icon: Truck,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
  },
  {
    title: "Price Intelligence",
    url: "/price-intelligence",
    icon: TrendingUp,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Audit Trail",
    url: "/audit",
    icon: Shield,
  },
];

const vendorItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Available Tenders",
    url: "/tenders",
    icon: FileText,
  },
  {
    title: "My Bids",
    url: "/bids",
    icon: Gavel,
  },
  {
    title: "My Contracts",
    url: "/contracts",
    icon: FileCheck,
  },
  {
    title: "My Projects",
    url: "/projects",
    icon: Truck,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
  },
  {
    title: "Price Intelligence",
    url: "/price-intelligence",
    icon: TrendingUp,
  },
];

const publicItems = [
  {
    title: "Browse Public Tenders",
    url: "/public-tenders",
    icon: Eye,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: Store,
  },
  {
    title: "Company Portal",
    url: "/marketplace/company-portal",
    icon: Building2,
  },
  // {
  //   title: "How It Works",
  //   url: "/how-it-works",
  //   icon: HelpCircle,
  // },
  // {
  //   title: "Contact",
  //   url: "/contact",
  //   icon: Phone,
  // },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return (
      <Sidebar>
        <SidebarHeader>
          <Link href={"/"}>
            <div className="flex items-center gap-2 px-4 py-2">
              <img
                src="https://storage-auctra.monzim.com/auctra-logo.webp"
                alt=""
                className="w-10 h-10"
              />
              <div>
                <h1 className="font-bold text-lg">Auctra</h1>
                <p className="text-xs text-muted-foreground">
                  Procurement System
                </p>
              </div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Public Access</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {publicItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }

  const menuItems =
    user.role === "procuring_officer" ? procuringOfficerItems : vendorItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"}>
          <div className="flex items-center gap-2 px-4 py-2">
            <img
              src="https://storage-auctra.monzim.com/auctra-logo.webp"
              alt=""
              className="w-10 h-10"
            />
            <div>
              <h1 className="font-bold text-lg">Auctra</h1>
              <p className="text-xs text-muted-foreground">
                Procurement System
              </p>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user.role === "procuring_officer"
              ? "Officer Portal"
              : "Vendor Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.organization}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
