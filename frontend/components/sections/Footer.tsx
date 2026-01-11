import { Github, Twitter, Linkedin, Command, Cpu } from "lucide-react";
import Logo from "../ui/Logo";

// Easily editable link variables
const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Documentation", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: <Github size={18} />, href: "#", label: "GitHub" },
  { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
  { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-muted border-t-2 border-secondary font-mono text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-sm text-white/60 max-w-sm leading-relaxed">
              Empower your data analysis with Scanalytics, the AI agent that
              transforms complex datasets into actionable insights in seconds.
            </p>
            <div className="flex gap-4">
              {SOCIALS.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 border border-secondary hover:bg-white hover:text-black transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                  // {group.title}
                </h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm hover:underline underline-offset-4 decoration-2 decoration-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* System Status / Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-secondary/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-sm uppercase font-bold text-white">
            <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span>Server: US-EAST-1</span>
            </div>
            <div className="flex items-center px-2.5 py-1 gap-1 bg-green-500">
              <div className="size-2 rounded-full bg-white" />
              <div className="rounded-full text-white" />
              <p className="text-white">All Systems Operational</p>
            </div>
          </div>

          <div className="text-sm uppercase tracking-widest">
            <p className="text-white">
              © {currentYear} Boxy_Dev Inc. [v1.0.4-Build_77]
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
