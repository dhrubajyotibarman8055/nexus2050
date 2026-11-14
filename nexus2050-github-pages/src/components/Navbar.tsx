import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#technology", label: "Technology" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden>
        <path d="M20 2 36 11v18L20 38 4 29V11L20 2Z" stroke="#00F0FF" strokeWidth="1.5" />
        <path d="M13 27V13l14 14V13" stroke="#fff" strokeWidth="2" strokeLinecap="square" />
        <circle cx="20" cy="20" r="2.2" fill="#8B5CF6" />
      </svg>
      <span className="font-display text-sm font-black tracking-[0.28em] text-white">
        NEXUS<span className="text-cyan-neon">//</span>2050
      </span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#home");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-white/10 bg-void/70 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 md:px-10">
          <a href="#home" aria-label="NEXUS 2050 home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "label group relative py-2 transition-colors",
                    active === l.href ? "text-cyan-neon" : "text-white/60 hover:text-white"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-cyan-neon shadow-[0_0_8px_#00f0ff] transition-transform duration-300",
                      active === l.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a href="#contact" className="btn-neon hidden !px-5 !py-3 sm:inline-flex">
              Initiate
              <ArrowUpRight size={14} />
            </a>
            <button
              className="grid h-11 w-11 place-items-center border border-white/20 text-white lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-gradient-to-r from-cyan-neon via-violet-neon to-transparent" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="bg-grid fixed inset-0 z-40 flex flex-col justify-center bg-void px-8 lg:hidden"
          >
            <ul className="space-y-5">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 font-display text-4xl font-black uppercase text-chrome"
                  >
                    <span className="label text-cyan-neon">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-neon mt-12 self-start">
              Initiate Sync <ArrowUpRight size={14} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
