"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  FileText,
  Shield,
  Database,
  BarChart3,
  Activity,
  MapPin,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import * as Types from "@/types/action.interfaces";

// Breadcrumb helper function
const getBreadcrumbs = (pathname: string) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ href: string; label: string; isLast: boolean }> = [];

  pathSegments.forEach((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    let label = segment.charAt(0).toUpperCase() + segment.slice(1);

    // Map path segments to readable names
    const labelMap: Record<string, string> = {
      dashboard: "Dashboard Overview",
      datahub: "Data Hub",
      analytics: "Analytics",
      map: "Interactive Map",
      profiles: "Profiles",
      candidates: "Candidates",
      parties: "Parties",
      counties: "Counties",
      reports: "Reports",
      risk: "Risk Analysis",
      activity: "Activity",
      profile: "Profile",
      settings: "Settings",
    };

    label = labelMap[label] || label;

    breadcrumbs.push({ href, label, isLast });
  });

  return breadcrumbs;
};

// Navigation configuration
const getNavigation = (pathname: string) => [
  {
    name: "Dashboard Overview",
    href: "/dashboard",
    icon: Home,
    current: pathname === "/dashboard",
  },
  {
    name: "Data Hub",
    href: "/dashboard/datahub",
    icon: Database,
    current: pathname === "/dashboard/datahub",
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    current: pathname === "/dashboard/analytics",
  },
  {
    name: "Interactive Map",
    href: "/dashboard/map",
    icon: MapPin,
    current: pathname === "/dashboard/map",
  },
  {
    name: "Profiles",
    href: "/dashboard/profiles",
    icon: Users,
    current: pathname === "/dashboard/profiles",
  },
  {
    name: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
    current: pathname === "/dashboard/candidates",
  },
  {
    name: "Parties",
    href: "/dashboard/parties",
    icon: Building2,
    current: pathname === "/dashboard/parties",
  },
  {
    name: "Counties",
    href: "/dashboard/counties",
    icon: Database,
    current: pathname === "/dashboard/counties",
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
    current: pathname === "/dashboard/reports",
  },
  {
    name: "Risk Analysis",
    href: "/dashboard/risk",
    icon: Shield,
    current: pathname === "/dashboard/risk",
  },
  {
    name: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
    current: pathname === "/dashboard/activity",
  },
];

// User navigation
const userNavigation = [
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  initialUser?: Types.User | null;
}

export function DashboardLayoutClient({
  children,
  initialUser,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <MobileMenu navigation={getNavigation(pathname)} />

      {/* Desktop layout */}
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <DashboardSidebar navigation={getNavigation(pathname)} />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 md:pl-64">
          {/* Header */}
          <DashboardHeader
            initialUser={initialUser}
            breadcrumbs={getBreadcrumbs(pathname)}
            userNavigation={userNavigation}
          />

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
