import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Globe } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <Globe className="w-12 h-12 mx-auto text-primary" />
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            ScanalyticsAI
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The Intelligence Layer for Modern Business
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full">Sign In</Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline">
                <svg
                  className="w-4 h-4 mr-2"
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Google</title>
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.9 1.62-3.03 0-5.49-2.3-5.49-5.09s2.46-5.09 5.49-5.09c1.3 0 2.38.49 3.24 1.27l2.44-2.44C16.16 3.57 14.08 3 12.48 3c-4.59 0-8.33 3.57-8.33 7.92s3.74 7.92 8.33 7.92c2.33 0 4.15-.77 5.5-2.13 1.42-1.42 1.82-3.42 1.82-5.56 0-.5-.05-.95-.1-1.42h-9.2z" />
                </svg>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Need an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
