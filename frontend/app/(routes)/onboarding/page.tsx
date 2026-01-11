"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Cpu, Database, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const steps = ["Description", "Blueprint", "Finalize"];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [generatedSchema, setGeneratedSchema] = useState(false);

  const handleNextStep = () => {
    if (currentStep === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setGeneratedSchema(true);
        setCurrentStep(1);
      }, 3000);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Onboarding Engine</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Let's configure your observability suite.</p>
        </div>

        <div className="mb-8">
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-full" />
          <div className="flex justify-between mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {steps.map((step, index) => (
              <div key={step} className={index <= currentStep ? "text-primary" : ""}>
                {step}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Provide a detailed description of your business model, target audience, and key user actions. The more detail, the better the AI will understand your needs.
              </p>
              <Textarea
                placeholder="e.g., We are a B2B SaaS platform that helps software teams manage their projects..."
                className="min-h-[200px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {currentStep === 1 && generatedSchema && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Sparkles className="w-5 h-5 mr-2 text-primary" /> Generated Event Schema</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">user_signup</CardTitle>
                    <Switch id="user_signup" defaultChecked />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Triggered when a new user creates an account.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">payment_success</CardTitle>
                    <Switch id="payment_success" defaultChecked />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Triggered on successful subscription payment.</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Database className="w-5 h-5 mr-2 text-primary" /> PostgreSQL Table Schema</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono">id</TableCell>
                      <TableCell className="font-mono">UUID</TableCell>
                      <TableCell>Primary key</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">event_name</TableCell>
                      <TableCell className="font-mono">VARCHAR(255)</TableCell>
                      <TableCell>Name of the event (e.g., 'user_signup')</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono">timestamp</TableCell>
                      <TableCell className="font-mono">TIMESTAMPTZ</TableCell>
                      <TableCell>When the event occurred</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-mono">user_id</TableCell>
                      <TableCell className="font-mono">UUID</TableCell>
                      <TableCell>Associated user</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
        
        {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Cpu className="w-5 h-5 mr-2 text-primary" /> Generated SQL Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Card>
                      <CardHeader>
                          <CardTitle className="text-base">User Sign-up Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                              <code>
{`SELECT COUNT(*) FROM events WHERE event_name = 'user_signup' AND timestamp > NOW() - INTERVAL '7 days'`}
                              </code>
                          </pre>
                          <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-bold">Threshold:</span> Alert if weekly signups drop below 10.
                          </p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader>
                          <CardTitle className="text-base">Payment Conversion</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
                              <code>
{`SELECT 
  CAST(SUM(CASE WHEN event_name = 'payment_success' THEN 1 ELSE 0 END) AS FLOAT) / 
  CAST(SUM(CASE WHEN event_name = 'user_signup' THEN 1 ELSE 0 END) AS FLOAT) * 100 
FROM events`}
                              </code>
                          </pre>
                           <p className="text-sm text-muted-foreground mt-2">
                            <span className="font-bold">Threshold:</span> Alert if conversion rate is less than 3%.
                          </p>
                      </CardContent>
                  </Card>
              </CardContent>
            </Card>
        )}

        <div className="mt-8 flex justify-end">
          {currentStep < steps.length -1 ? (
            <Button onClick={handleNextStep} disabled={isLoading || (currentStep === 0 && !description)}>
              {isLoading ? "AI is Thinking..." : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button>Commit to Database</Button>
          )}
        </div>
      </div>
    </div>
  );
}