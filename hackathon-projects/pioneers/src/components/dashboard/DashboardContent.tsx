"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  FileText,
  Download,
  Filter,
} from "lucide-react";
import * as Types from "@/types/action.interfaces";
import KenyaMap from "./KenyaMap";

interface DashboardContentProps {
  initialUser: Types.User | null;
  initialError: string | null;
  initialStatistics?: {
    counties: number;
    parties: number;
    candidates: number;
    total_population: number;
  } | null;
}

export default function DashboardContent({
  initialUser,
  initialError,
  initialStatistics,
}: DashboardContentProps) {
  const router = useRouter();

  // If there's a critical error, show error state (but not for backend issues)
  if (initialError && initialError.includes("Failed to load user profile")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertDescription>{initialError}</AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  // If no user data, show loading state (shouldn't happen with SSR)
  if (!initialUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Key Metrics */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaign Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time political finance monitoring and risk analysis
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Campaigns
                </p>
                <p className="text-2xl font-bold">247</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +12% this month
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Compliance Rate
                </p>
                <p className="text-2xl font-bold">87.3%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +5.2% improvement
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Red Flags
                </p>
                <p className="text-2xl font-bold">23</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500">8 high priority</span>
                </div>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Funds
                </p>
                <p className="text-2xl font-bold">KES 2.4B</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">
                    +18% vs last cycle
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kenya Map - Takes 2/3 space */}
        <div className="lg:col-span-2">
          <KenyaMap />
        </div>

        {/* Risk Alerts Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="h-2 w-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nairobi - Overspending</p>
                  <p className="text-xs text-muted-foreground">
                    Exceeded limit by KES 2.3M
                  </p>
                  <Badge variant="destructive" className="mt-1 text-xs">
                    High
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Mombasa - Late Reporting
                  </p>
                  <p className="text-xs text-muted-foreground">
                    3 days overdue
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Medium
                  </Badge>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Kisumu - Unverified Source
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 donations need verification
                  </p>
                  <Badge className="mt-1 text-xs bg-yellow-100 text-yellow-800">
                    Low
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Transparency Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jubilee Party</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ODM</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">UDA</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "76%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">76%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wiper</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">68%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-3 border-b">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  New campaign report submitted
                </p>
                <p className="text-xs text-muted-foreground">
                  Nairobi County - 2 hours ago
                </p>
              </div>
              <Badge variant="outline">Report</Badge>
            </div>
            <div className="flex items-center space-x-4 pb-3 border-b">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Spending limit exceeded</p>
                <p className="text-xs text-muted-foreground">
                  Mombasa County - 5 hours ago
                </p>
              </div>
              <Badge variant="destructive">Alert</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Compliance verification completed
                </p>
                <p className="text-xs text-muted-foreground">
                  Kisumu County - 1 day ago
                </p>
              </div>
              <Badge variant="secondary">Compliance</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
