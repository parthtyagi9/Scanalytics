import { Card, CardDescription, CardTitle } from "../ui/card";
import { Terminal, Cpu, Layout, Globe } from "lucide-react"; // Optional: adding icons for "eye-catching" factor

const features = [
  {
    title: "Performance",
    desc: "Optimized for speed and efficiency.",
    icon: <Cpu size={20} />,
  },
  {
    title: "Interface",
    desc: "Clean, boxy, and developer-first UI.",
    icon: <Layout size={20} />,
  },
  {
    title: "Global",
    desc: "Deploy to the edge with zero latency.",
    icon: <Globe size={20} />,
  },
  {
    title: "CLI Tool",
    desc: "Manage everything via the command line.",
    icon: <Terminal size={20} />,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full max-w-7xl mx-auto py-20 px-4 font-mono"
    >
      {/* Section Header with a "Tag" style */}
      <div className="mb-16 space-y-4">
        <span className="bg-card text-white px-3 py-1 text-sm inline-block border-2 border-secondary">
          v1.0.4 // FEATURES
        </span>
        <h2 className="text-5xl font-white uppercase tracking-tighter">
          Core Capabilities
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-card">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative border border-collapse p-8 hover:bg-card transition-colors duration-200"
          >
            {/* Index Label [01] */}
            <span className="absolute top-4 right-4 text-xs font-bold opacity-30 group-hover:opacity-100">
              [{String(index + 1).padStart(2, "0")}]
            </span>

            <div className="space-y-4">
              <div className="p-2 border-2 border-secondary w-fit bg-card group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all">
                {feature.icon}
              </div>

              <CardTitle className="text-2xl font-white uppercase">
                {feature.title}
              </CardTitle>

              <CardDescription className="text-white font-medium leading-relaxed">
                {feature.desc} This highlights the key benefits and
                functionalities of this specific module.
              </CardDescription>

              <div className="pt-4">
                <button className="text-xs font-bold underline underline-offset-4 hover:no-underline uppercase">
                  Explore Docs -&gt;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
