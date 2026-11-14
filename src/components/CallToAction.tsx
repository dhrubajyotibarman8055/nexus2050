import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Reveal, SplitHeading } from "./ui";

export default function CallToAction() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1.15]);
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <section id="contact" ref={ref} className="relative isolate overflow-hidden bg-void py-32 md:py-48">
      {/* perspective grid floor */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[60%] overflow-hidden [perspective:420px]">
        <div
          className="bg-grid absolute inset-x-[-50%] bottom-0 h-[200%] origin-bottom [transform:rotateX(62deg)] [mask-image:linear-gradient(to_top,#000,transparent_80%)]"
          style={{ animation: reduce ? undefined : "grid-run 3s linear infinite", backgroundSize: "70px 70px" }}
        />
      </div>
      <style>{`@keyframes grid-run{to{background-position:0 70px}}`}</style>

      {/* animated gradient orb */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { scale }}
        className="absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 animate-gradient rounded-full bg-[linear-gradient(120deg,#00f0ff,#8b5cf6,#00f0ff)] bg-[length:300%_300%] opacity-25 blur-[120px]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 scanline opacity-50" />

      <div className="mx-auto max-w-[1500px] px-5 text-center md:px-10">
        <Reveal>
          <div className="label mb-8 inline-flex items-center gap-3 border border-cyan-neon/40 bg-cyan-neon/5 px-4 py-2 text-cyan-neon">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-neon" />
            Enrollment window · Cohort 07 · 312 slots left
          </div>
        </Reveal>

        <SplitHeading
          lines={["EVOLUTION IS", "NO LONGER", "OPTIONAL."]}
          lineClassNames={["text-chrome", "text-chrome", "text-neon"]}
          className="font-display text-[clamp(2.4rem,9vw,8.5rem)] font-black leading-[0.95] tracking-tighter"
        />

        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            The next stage of humanity is already being written. Reserve your consultation and step into the architecture of tomorrow.
          </p>
        </Reveal>

        <Reveal delay={0.45} className="mx-auto mt-12 max-w-xl">
          {done ? (
            <div role="status" className="glass flex items-center justify-center gap-3 p-5 font-mono text-sm text-cyan-neon">
              <Check size={18} /> TRANSMISSION RECEIVED — expect contact within 24h.
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <div className="glass flex flex-1 items-center gap-3 px-4 focus-within:border-cyan-neon">
                <Mail size={16} className="text-cyan-neon" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@human.net"
                  className="w-full bg-transparent py-4 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-neon justify-center">
                Begin evolution <ArrowRight size={16} />
              </button>
            </form>
          )}
          <p className="label mt-4 text-white/30">Encrypted · No spam · Neural-safe</p>
        </Reveal>
      </div>
    </section>
  );
}
