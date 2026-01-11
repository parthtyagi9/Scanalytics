"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Terminal,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const trafficData = [
  { name: "JAN", traffic: 4000, errors: 24 },
  { name: "FEB", traffic: 3000, errors: 13 },
  { name: "MAR", traffic: 2000, errors: 98 },
  { name: "APR", traffic: 2780, errors: 39 },
  { name: "MAY", traffic: 1890, errors: 48 },
  { name: "JUN", traffic: 2390, errors: 38 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 font-mono text-white p-2">
      {/* Header System Status */}
      <div className="flex items-center justify-between border-b-2 border-secondary/30 pb-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">
            Analytics_Terminal
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase">
            <Activity size={12} className="animate-pulse" />
            Live_System_Metrics // v1.0.4
          </div>
        </div>
        <div className="bg-secondary text-black text-[10px] font-bold px-3 py-1 uppercase italic">
          Node_Status: Optimal
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Revenue_Per_Order"
          value="$34.50"
          desc="AI_ANALYSIS: EXCELLENT"
          icon={<CheckCircle className="text-secondary" />}
        />
        <MetricCard
          title="Avg_Delivery_Time"
          value="48m"
          desc="-2.5% FROM_LAST_24H"
          icon={<TrendingUp className="text-secondary" />}
        />
        {/* Changed warning card to monochrome */}
        <MetricCard
          title="Retention_Rate"
          value="28%"
          desc="STATUS: NEEDS_ATTENTION"
          icon={<AlertTriangle className="text-white" />}
        />
        <MetricCard
          title="Food_Cost_Pct"
          value="18%"
          desc="CRITICAL_PATHS_MONITORED"
          icon={<Activity className="text-secondary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4 rounded-none border-2 border-secondary bg-card shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
          <CardHeader className="border-b-2 border-secondary/20">
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between">
              Traffic_vs_Errors
              <span className="text-[10px] font-normal opacity-40">
                Scale: Logarithmic_Delta
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff40"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#ffffff40"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#ffffff40"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "2px solid #fff",
                      borderRadius: "0px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="stepAfter"
                    dataKey="traffic"
                    stroke="#fff"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="stepAfter"
                    dataKey="errors"
                    stroke="#ef4444" // Kept red for errors as it's distinct from yellow/amber
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Summary: Terminal Style */}
        <Card className="col-span-4 lg:col-span-3 rounded-none border-2 border-secondary bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden">
          <CardHeader className="bg-secondary text-black py-3">
            <CardTitle className="flex items-center text-xs font-black uppercase italic">
              <Bot className="w-4 h-4 mr-2" />
              Executive_Summary_Output
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4 text-xs leading-relaxed">
              <p className="flex gap-2">
                <span className="text-secondary font-bold font-sans tracking-tighter flex-shrink-0 mt-0.5">
                  0x01
                </span>
                <span>
                  Business health is strong (Macro_Score: 92). Engagement
                  trending upward by{" "}
                  <span className="text-secondary">12.5%</span>.
                </span>
              </p>
              {/* Changed yellow highlights to white/monochrome */}
              <p className="flex gap-2 border-l-2 border-white/50 pl-4 py-2 bg-white/5">
                <span className="text-white font-bold font-sans tracking-tighter flex-shrink-0 mt-0.5">
                  0x02
                </span>
                <span className="italic opacity-80 underline underline-offset-4 decoration-white/30 font-bold">
                  Anomaly detected in payment_flow. active_alerts: 03.
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-secondary font-bold font-sans tracking-tighter flex-shrink-0 mt-0.5">
                  0x03
                </span>
                <span className="opacity-70">
                  Investigate `payment_failure` spike. Source identified:
                  third-party payment gateway latency.
                </span>
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full rounded-none border-secondary text-secondary hover:bg-secondary hover:text-black font-bold uppercase text-[10px] h-10"
              >
                Execute_Diagnostic_Routine{" "}
                <ChevronRight className="ml-2 w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simplified MetricCard component (removed variant prop)
function MetricCard({
  title,
  value,
  desc,
  icon,
}: {
  title: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-none border-2 border-secondary bg-card transition-all group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {title}
        </CardTitle>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="text-4xl font-black italic tracking-tighter mb-1">
          {value}
        </div>
        <div className="flex items-center gap-1">
          <Terminal size={10} className="text-secondary" />
          <p className="text-[9px] font-bold text-white/40 uppercase">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
