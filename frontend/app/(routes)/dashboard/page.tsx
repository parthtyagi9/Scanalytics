"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const trafficData = [
  { name: 'Jan', traffic: 4000, errors: 24 },
  { name: 'Feb', traffic: 3000, errors: 13 },
  { name: 'Mar', traffic: 2000, errors: 98 },
  { name: 'Apr', traffic: 2780, errors: 39 },
  { name: 'May', traffic: 1890, errors: 48 },
  { name: 'Jun', traffic: 2390, errors: 38 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Macro Health Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">Excellent standing based on AI analysis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Volume (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,230,459</div>
            <p className="text-xs text-muted-foreground">+12.5% from last 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logic Coverage</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">All critical paths monitored</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic vs. Errors</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trafficData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="traffic" stroke="#2563eb" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              AI Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Good morning. Overall business health is strong, with a Macro Score of 92. User engagement continues its upward trend, with event volume increasing by 12.5% over the last 24 hours.
            </p>
            <p className="text-sm">
              However, we've detected a minor anomaly in the payment processing flow, leading to a slight increase in transaction errors. This is currently responsible for 3 active alerts.
            </p>
            <p className="text-sm">
              Recommendation: Investigate the `payment_failure` event spike in the observability dashboard. The AI suggests a potential issue with a third-party payment gateway.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}