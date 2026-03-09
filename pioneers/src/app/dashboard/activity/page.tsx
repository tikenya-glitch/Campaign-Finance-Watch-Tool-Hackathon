import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, User, FileText, Shield, TrendingUp, Search, Filter } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-muted-foreground">
            Real-time activity and system events monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">147</div>
            <p className="text-xs text-muted-foreground">
              +23% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Logins</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Active users today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              New alerts today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Real-time system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "2 minutes ago",
                type: "login",
                user: "John Kamau",
                action: "User logged in",
                details: "IP: 192.168.1.100",
                icon: User,
                color: "text-green-600"
              },
              {
                time: "15 minutes ago",
                type: "report",
                user: "Mary Wanjiru",
                action: "Generated monthly compliance report",
                details: "Nairobi Constituency",
                icon: FileText,
                color: "text-blue-600"
              },
              {
                time: "1 hour ago",
                type: "risk",
                user: "System",
                action: "High risk alert triggered",
                details: "Candidate: David Mutua - Unusual transactions detected",
                icon: Shield,
                color: "text-orange-600"
              },
              {
                time: "2 hours ago",
                type: "upload",
                user: "James Muriuki",
                action: "Uploaded financial document",
                details: "Q1_2024_financial_report.pdf",
                icon: FileText,
                color: "text-purple-600"
              },
              {
                time: "3 hours ago",
                type: "login",
                user: "Grace Kariuki",
                action: "User logged in",
                details: "IP: 192.168.1.102",
                icon: User,
                color: "text-green-600"
              },
              {
                time: "4 hours ago",
                type: "report",
                user: "Peter Ndungu",
                action: "Generated risk assessment report",
                details: "Mombasa County analysis",
                icon: Shield,
                color: "text-blue-600"
              },
              {
                time: "5 hours ago",
                type: "system",
                user: "System",
                action: "Database backup completed",
                details: "Backup size: 2.3GB, Duration: 12min",
                icon: Activity,
                color: "text-gray-600"
              },
              {
                time: "6 hours ago",
                type: "login",
                user: "Sarah Njoroge",
                action: "User logged in",
                details: "IP: 192.168.1.103",
                icon: User,
                color: "text-green-600"
              },
              {
                time: "8 hours ago",
                type: "report",
                user: "Admin",
                action: "Generated weekly analytics report",
                details: "All counties summary",
                icon: TrendingUp,
                color: "text-purple-600"
              },
              {
                time: "12 hours ago",
                type: "system",
                user: "System",
                action: "Scheduled maintenance completed",
                details: "Database optimization and cleanup",
                icon: Activity,
                color: "text-gray-600"
              }
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`h-2 w-2 rounded-full bg-${activity.color.split('-')[1]}-500`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    <p className="text-sm font-medium">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{activity.user}</span> • {activity.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity by Type</CardTitle>
            <CardDescription>
              Distribution of different activity types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "User Logins", count: 89, percentage: 60 },
                { type: "Reports Generated", count: 23, percentage: 16 },
                { type: "Risk Alerts", count: 18, percentage: 12 },
                { type: "File Uploads", count: 17, percentage: 12 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{item.count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Activity Hours</CardTitle>
            <CardDescription>
              Most active time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "9:00 - 11:00 AM", activity: "High", users: 45 },
                { time: "2:00 - 4:00 PM", activity: "Medium", users: 32 },
                { time: "4:00 - 6:00 PM", activity: "High", users: 38 },
                { time: "7:00 - 9:00 PM", activity: "Low", users: 15 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.time}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={item.activity === "High" ? "default" : item.activity === "Medium" ? "secondary" : "outline"} 
                      className="text-xs"
                    >
                      {item.activity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.users} users</span>
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
