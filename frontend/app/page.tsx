import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main>
      <Hero />

      <section id="features">
        <Features />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

      <section id="docs">
        <CTA />
      </section>

      <Footer />
    </main>
  );
}