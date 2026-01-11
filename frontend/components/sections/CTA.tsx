import { Copy, Terminal } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full max-w-7xl mx-auto py-32 px-4 font-mono text-white">
      <div className="relative group">
        {/* Main CTA Box */}
        <div className="bg-card border-2 border-white p-8 md:p-16 transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-green-500">
                  System_Ready: 200 OK
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">
                Stop Building <br />
                <span className="bg-white text-black px-2">
                  Start Deploying
                </span>
              </h2>
            </div>

            {/* Main Action Button */}
            <div className="w-full md:w-auto">
              <Link
                href="/auth/register"
                className="flex flex-col justify-end items-end"
              >
                <button className="w-full md:w-64 py-6 bg-white text-black font-black uppercase text-xl border-2 border-white hover:bg-transparent hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1">
                  Get Started_
                </button>
              </Link>
              <p className="text-sm mt-4 text-center opacity-40 uppercase tracking-tighter">
                No credit card required // cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -z-10 top-4 left-4 w-full h-full border-2 border-secondary/20 border-dashed pointer-events-none" />
      </div>
    </section>
  );
}
