import Hero from "@/components/Hero";
import Features from "@/components/sections/Features";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { ScanSearchIcon } from "lucide-react";
import Link from "next/link";

const links = [
  {
    href: "",
    title: "Features",
  },
  {
    href: "",
    title: "Pricing",
  },
  {
    href: "",
    title: "Docs",
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative h-svh w-svw">
        <div className="absolute inset-8">
          <Hero />
          <div className="pointer-events-none fixed top-0 left-0 w-svw h-svh z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.40)_0%,transparent_100%)]" />
          <nav className="absolute top-2 w-full max-w-7xl left-1/2 -translate-x-1/2 flex justify-between items-center">
            <Logo />
            <ul className="flex items-center justify-center gap-12">
              {links.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    className="text-lg text-gray-300 hover:text-white transition"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
              <Link href="/auth/reigster">
                <Button>Sign Up</Button>
              </Link>
            </ul>
          </nav>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-5xl w-max text-center px-4">
            <h1>Your AI Analytics Agent.</h1>
            <p className="text-muted-foreground mt-8 text-2xl">
              Empower your data analysis with Scanalytics, the AI agent that
              transforms complex datasets into actionable insights in seconds.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6">
              <Button size="lg" variant={"secondary"} className="h-12 px-8">
                Learn More
              </Button>
              <Link href="/auth/reigster">
                <Button size="lg" className="h-12 px-8">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Features />
    </main>
  );
}
