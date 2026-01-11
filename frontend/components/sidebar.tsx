"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  ChevronsUpDown,
  Cpu,
  Gauge,
  Globe,
  Home,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/observability", icon: Gauge, label: "Observability" },
  { href: "/integration", icon: Settings, label: "Integration" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Globe className="h-6 w-6 text-primary" />
            <span>ScanalyticsAI</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === href && "bg-muted text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Engine Pulse</p>
              <p className="text-xs text-green-500">Real-time Normal</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <span>Acme Inc.</span>
                </div>
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>My Organizations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Acme Inc.</DropdownMenuItem>
              <DropdownMenuItem>Monsters Inc.</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create Workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
