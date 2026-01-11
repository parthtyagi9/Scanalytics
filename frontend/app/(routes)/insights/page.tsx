"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const insights = [
  {
    title: "Daily Active Users (DAU)",
    sql: "SELECT COUNT(DISTINCT user_id) FROM events WHERE timestamp >= NOW() - INTERVAL '1 day';",
    value: 1250,
    target: 1200,
    status: "Healthy",
    description:
      "Measures user engagement by counting unique users who performed any action in the last 24 hours. High DAU is a strong indicator of product health and user retention.",
  },
  {
    title: "Signup Conversion Rate",
    sql: "SELECT CAST(SUM(CASE WHEN event_name = 'user_signup' THEN 1 ELSE 0 END) AS FLOAT) / CAST(COUNT(DISTINCT session_id) AS FLOAT) * 100 FROM events WHERE event_name = 'page_view' AND page_path = '/register';",
    value: 4.2,
    target: 5.0,
    status: "Warning",
    description:
      "The percentage of users who visit the registration page and successfully sign up. A low rate might indicate friction in the signup process.",
  },
  {
    title: "Payment Failure Rate",
    sql: "SELECT CAST(SUM(CASE WHEN event_name = 'payment_failure' THEN 1 ELSE 0 END) AS FLOAT) / CAST(SUM(CASE WHEN event_name LIKE 'payment_%' THEN 1 ELSE 0 END) AS FLOAT) * 100 FROM events;",
    value: 8.9,
    target: 2.0,
    status: "Critical",
    description:
      "The percentage of payment attempts that fail. A high rate is a critical issue that directly impacts revenue and user trust.",
  },
] as const;

const statusIcons = {
  Healthy: <CheckCircle className="h-5 w-5 text-green-500" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Critical: <XCircle className="h-5 w-5 text-red-500" />,
};

export default function InsightsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AI-Generated Insights</h1>
            <p className="text-muted-foreground">
              SQL queries automatically created to monitor your business logic.
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Engine"}
          </Button>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  {statusIcons[insight.status]}
                  <CardTitle>{insight.title}</CardTitle>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{insight.description}</p>
                  </TooltipContent>
                </Tooltip>
              </CardHeader>
              <CardContent className="space-y-4">
                <SyntaxHighlighter
                  language="sql"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, borderRadius: "0.5rem" }}
                >
                  {insight.sql}
                </SyntaxHighlighter>
                <div className="mt-4 mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      Current: {insight.value}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Target: {insight.target}
                    </span>
                  </div>
                  <Progress
                    value={(insight.value / insight.target) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
