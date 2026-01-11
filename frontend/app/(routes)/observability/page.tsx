"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Bot } from "lucide-react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const heatmapData = [
  { hour: '00:00', day: 'Sunday', value: 2 },
  { hour: '03:00', day: 'Sunday', value: 5 },
  { hour: '09:00', day: 'Monday', value: 12 },
  { hour: '14:00', day: 'Wednesday', value: 30 },
  { hour: '15:00', day: 'Wednesday', value: 35 },
  { hour: '17:00', day: 'Friday', value: 22 },
];

const topFailures = [
    { error: "APIError: 503 Service Unavailable", count: 128, impact: "High" },
    { error: "TypeError: Cannot read properties of null", count: 92, impact: "Medium" },
    { error: "DatabaseError: Connection refused", count: 45, impact: "High" },
    { error: "ValidationError: Invalid email format", count: 22, impact: "Low" },
];

const eventStream = [
    { event: "payment_failure", user: "user_123", timestamp: "2m ago", details: "{ reason: 'insufficient_funds' }" },
    { event: "user_signup", user: "user_456", timestamp: "3m ago", details: "{ source: 'google' }" },
    { event: "page_view", user: "user_789", timestamp: "5m ago", details: "{ path: '/pricing' }" },
    { event: "api_error", user: "system", timestamp: "6m ago", details: "{ status: 503 }" },
];

export default function ObservabilityPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Observability</h1>
            <p className="text-muted-foreground">Drill down into errors, logs, and system performance.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Error Frequency Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <ScatterChart>
                        <XAxis type="category" dataKey="hour" name="hour" />
                        <YAxis type="category" dataKey="day" name="day" />
                        <ZAxis type="number" dataKey="value" name="errors" range={[100, 1000]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Errors" data={heatmapData} fill="#ef4444" shape="square" />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Top Impacting Failures</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Error</TableHead>
                                <TableHead>Count</TableHead>
                                <TableHead>Impact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topFailures.map((failure, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{failure.error}</TableCell>
                                    <TableCell>{failure.count}</TableCell>
                                    <TableCell className={failure.impact === 'High' ? 'text-red-500' : failure.impact === 'Medium' ? 'text-yellow-500' : 'text-green-500'}>{failure.impact}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Bot className="w-5 h-5 mr-2" /> AI-Assisted Debugging</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>APIError: 503 Service Unavailable</AccordionTrigger>
                            <AccordionContent>
                                This error indicates that a downstream service is unavailable. The AI suggests checking the status of your primary API gateway and the `billing-service`. Latency in the `us-east-1` region has been high in the last hour.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>TypeError: Cannot read properties of null</AccordionTrigger>
                            <AccordionContent>
                                This common JavaScript error happens when trying to access a property on a `null` or `undefined` object. The stack trace points to the `UserProfile` component. The AI recommends adding a conditional rendering check to ensure the `user` object exists before accessing its properties.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Live Raw Event Stream</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter events..." className="pl-8" />
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {eventStream.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono">{log.event}</TableCell>
                                <TableCell className="font-mono">{log.user}</TableCell>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell className="font-mono">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}