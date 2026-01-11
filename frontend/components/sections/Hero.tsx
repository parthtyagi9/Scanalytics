import Link from "next/link";
import { Button } from "../ui/button"; // Assuming shadcn, we'll override rounding
import { Command, ChevronRight } from "lucide-react";
import SquaresGrid from "./SquaresGrid";

const links = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Docs", href: "#docs" },
];

export default function HeroSection() {
  return (
    <section className="relative h-svh w-full bg-background font-mono text-white overflow-hidden">
      {/* 2. THE VIEWPORT FRAME */}
      <div className="absolute inset-4 md:inset-8 border-2 border-secondary z-10 pointer-events-none flex flex-col justify-between">
        <SquaresGrid />
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav className="absolute top-16 w-full max-w-6xl left-1/2 -translate-x-1/2 z-20 px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center border-white/10 pb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-white p-1 transition-transform group-hover:rotate-90">
              <Command size={20} className="text-black" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter">
              Scanalytics
            </span>
          </div>

          <ul className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  className="text-sm font-bold uppercase hover:text-secondary transition-colors italic"
                >
                  [{link.title}]
                </a>
              </li>
            ))}
            <Link href="/auth/register">
              <Button className="rounded-none bg-white text-black font-black uppercase hover:bg-secondary hover:text-white border-2 border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none">
                Sign Up_
              </Button>
            </Link>
          </ul>
        </div>
      </nav>

      {/* 4. MAIN CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="mt-8 mb-4">
          <span className="bg-secondary/20 border-secondary border-2 px-3 py-2 text-sm text-white font-bold uppercase tracking-widest">
            AI_Agent_Active
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-28 italic">
          Your AI <br />
          <span className="bg-white text-black px-4 not-italic">
            Analytics
          </span>{" "}
          <br />
          Agent.
        </h1>

        <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl font-medium leading-relaxed">
          Empower your data analysis with Scanalytics. Transform complex
          datasets into actionable insights in seconds—not hours.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
          <Button
            variant="outline"
            size="lg"
            className="rounded-none w-full sm:w-48 h-14 border-2 border-white font-black uppercase hover:bg-white hover:text-black transition-all"
          >
            Learn More
          </Button>
          <Link href="/auth/register" className="w-full sm:w-48">
            <Button
              size="lg"
              className="rounded-none w-full h-14 bg-white text-black font-black uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Get Started <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
