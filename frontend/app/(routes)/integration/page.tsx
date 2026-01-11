"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const NpmInstall = `npm install analytix-ai`;
const YarnInstall = `yarn add analytix-ai`;
const PnpmInstall = `pnpm add analytix-ai`;

const SdkUsage = `import { ScanalyticsAI } from 'analytix-ai';

const analytix = new ScanalyticsAI({
  projectId: 'YOUR_PROJECT_ID',
});

// Track an event
analytix.track('user_signup', {
  userId: 'user_123',
  plan: 'premium',
});`;

export default function IntegrationPage() {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your stack and start sending events to ScanalyticsAI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>
            Use this key in your application's backend to authenticate with the
            ScanalyticsAI API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={
                showKey
                  ? "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
                  : "************************************"
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SDK Installation & Usage</CardTitle>
          <CardDescription>
            Install our lightweight SDK to easily send events from your
            application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="npm">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            </TabsList>
            <TabsContent value="npm">
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: "0.5rem" }}
              >
                {NpmInstall}
              </SyntaxHighlighter>
            </TabsContent>
            <TabsContent value="yarn">
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: "0.5rem" }}
              >
                {YarnInstall}
              </SyntaxHighlighter>
            </TabsContent>
            <TabsContent value="pnpm">
              <SyntaxHighlighter
                language="bash"
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: "0.5rem" }}
              >
                {PnpmInstall}
              </SyntaxHighlighter>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              customStyle={{ margin: 0, borderRadius: "0.5rem" }}
            >
              {SdkUsage}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Sinks</CardTitle>
            <CardDescription>
              Configure where your processed data is stored.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>PostgreSQL</Label>
                <Input placeholder="postgres://user:pass@host:port/db" />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <p className="text-sm font-medium">Google Analytics</p>
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>"Send Test Event" Playground</CardTitle>
            <CardDescription>
              Send a sample event to verify your integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Event Name</Label>
              <Input id="eventName" defaultValue="user_signup" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventPayload">Payload (JSON)</Label>
              <textarea
                id="eventPayload"
                className="w-full h-24 p-2 border rounded-md"
                defaultValue='{ "userId": "test_user_123" }'
              />
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
