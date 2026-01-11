import { Card, CardDescription, CardTitle } from "../ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    desc: "For hobbyists and side projects.",
    features: ["3 Projects", "Basic Analytics", "Community Support"],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    desc: "For professional devs and small teams.",
    features: [
      "Unlimited Projects",
      "Advanced Metrics",
      "Priority Support",
      "Custom Domains",
    ],
    button: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored for large scale organizations.",
    features: [
      "SLA Guarantees",
      "Dedicated Manager",
      "Custom Onboarding",
      "Audit Logs",
    ],
    button: "Contact Us",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-4 font-mono text-white">
      {/* Section Header */}
      <div className="mb-16 space-y-4">
        <span className="bg-card text-white px-3 py-1 text-sm inline-block border-2 border-secondary uppercase">
          v1.0.4 // PRICING_MODELS
        </span>
        <h2 className="text-5xl font-black uppercase tracking-tighter">
          Scalable Plans
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-start">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`relative p-8 border-2 flex flex-col h-full transition-all duration-300 ${
              tier.popular
                ? "bg-secondary/10 border-white z-10 md:-translate-y-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                : "bg-card border-secondary md:translate-y-0"
            }`}
          >
            {/* Popular Tag */}
            {tier.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 text-xs font-black uppercase border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Most Popular
              </span>
            )}

            <div className="mb-8">
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest">
                Tier_{String(index + 1).padStart(2, "0")}
              </span>
              <CardTitle className="text-3xl font-black uppercase mt-2">
                {tier.name}
              </CardTitle>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-black">{tier.price}</span>
                {tier.price !== "Custom" && (
                  <span className="text-sm opacity-60">/mo</span>
                )}
              </div>
              <CardDescription className="text-white/70 mt-4 h-12">
                {tier.desc}
              </CardDescription>
            </div>

            <div className="space-y-4 flex-grow border-t-2 border-secondary/30 pt-8 mb-8">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm italic">
                  <Check size={14} className="text-white" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-4 text-sm font-black uppercase border-2 transition-all ${
                tier.popular
                  ? "bg-white text-black border-white hover:bg-transparent hover:text-white"
                  : "bg-card text-white border-secondary hover:bg-white hover:text-black hover:border-white"
              }`}
            >
              {tier.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
