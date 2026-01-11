import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
