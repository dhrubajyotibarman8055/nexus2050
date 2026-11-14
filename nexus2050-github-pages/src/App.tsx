import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Technology from "@/components/Technology";
import Features from "@/components/Features";
import Interactive from "@/components/Interactive";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

function Boot({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setP((v) => Math.min(100, v + 4 + Math.random() * 6)), 45);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (p >= 100) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
  }, [p, onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-grid fixed inset-0 z-[200] grid place-items-center bg-void"
      role="status"
      aria-label="Loading"
    >
      <div className="w-[min(320px,80vw)]">
        <div className="label mb-3 flex justify-between text-cyan-neon">
          <span>NEXUS//2050</span>
          <span>{Math.floor(p)}%</span>
        </div>
        <div className="h-px w-full bg-white/10">
          <div className="h-full bg-cyan-neon shadow-[0_0_12px_#00f0ff]" style={{ width: `${p}%` }} />
        </div>
        <div className="label mt-3 text-white/40">
          {p < 40 ? "Calibrating neural link…" : p < 80 ? "Syncing biomechanics…" : "Initializing interface…"}
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const reduce = useReducedMotion();
  const [booted, setBooted] = useState(!!reduce);

  useEffect(() => {
    document.body.style.overflow = booted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [booted]);

  return (
    <>
      <a
        href="#technology"
        className="sr-only z-[300] bg-cyan-neon px-4 py-2 font-mono text-xs text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <AnimatePresence>{!booted && <Boot onDone={() => setBooted(true)} />}</AnimatePresence>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Technology />
        <Features />
        <Interactive />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
