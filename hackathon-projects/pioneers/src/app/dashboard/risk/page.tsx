import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingUp, Search, Filter, Eye } from "lucide-react";

export default function RiskPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Risk Analysis</h2>
          <p className="text-muted-foreground">
            Monitor and assess political finance risks across candidates and parties
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <TrendingUp className="mr-2 h-4 w-4" />
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">23</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Risk</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">93</div>
            <p className="text-xs text-muted-foreground">
              -3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-xs text-muted-foreground">
              Average risk score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
            High Risk Alerts
          </CardTitle>
          <CardDescription>
            Immediate attention required for these high-risk candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "John Kamau", constituency: "Nairobi West", risk: "9.2", issues: ["Unusual transaction patterns", "Exceeding spending limits"] },
              { name: "Mary Wanjiru", constituency: "Kiambu Central", risk: "8.7", issues: ["Foreign funding sources", "Late reporting"] },
              { name: "David Mutua", constituency: "Mombasa North", risk: "8.1", issues: ["Cash-heavy transactions", "Missing documentation"] },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-destructive/5">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">{alert.name}</p>
                    <p className="text-sm text-muted-foreground">{alert.constituency}</p>
                    <div className="flex gap-1 mt-1">
                      {alert.issues.map((issue, j) => (
                        <Badge key={j} variant="destructive" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-destructive">{alert.risk}</div>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <Button size="sm" className="mt-2">
                    <Eye className="mr-2 h-4 w-4" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
            <CardDescription>
              Breakdown of risk types identified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Financial Irregularities", count: 15, trend: "up" },
                { category: "Late Reporting", count: 12, trend: "down" },
                { category: "Documentation Issues", count: 8, trend: "stable" },
                { category: "Foreign Funding", count: 6, trend: "up" },
                { category: "Excessive Spending", count: 4, trend: "down" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{item.count}</span>
                    <Badge variant={item.trend === "up" ? "destructive" : item.trend === "down" ? "default" : "secondary"}>
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Risk Assessments</CardTitle>
            <CardDescription>
              Latest risk analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { candidate: "Sarah Njoroge", date: "2 hours ago", score: 4.2, status: "Completed" },
                { candidate: "James Muriuki", date: "5 hours ago", score: 6.1, status: "Completed" },
                { candidate: "Grace Kariuki", date: "1 day ago", score: 2.8, status: "Completed" },
                { candidate: "Peter Ndungu", date: "2 days ago", score: 7.3, status: "In Progress" },
              ].map((assessment, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{assessment.candidate}</p>
                    <p className="text-sm text-muted-foreground">{assessment.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{assessment.score}</div>
                    <Badge variant="outline" className="text-xs">
                      {assessment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
