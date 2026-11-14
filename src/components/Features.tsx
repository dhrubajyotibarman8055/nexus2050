import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
const neural = `${import.meta.env.BASE_URL}images/neural.jpg`;
import { HudCorners, Reveal, SectionHeader } from "./ui";
import { cn } from "@/utils/cn";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    code: "F-01",
    title: "Thought-speed Control",
    text: "Intent is decoded from 4,096 cortical channels and executed in under half a millisecond — faster than a reflex, quieter than a whisper.",
    metric: 96,
    metricLabel: "Signal fidelity",
    specs: [["Channels", "4,096"], ["Latency", "0.4 ms"], ["Sampling", "30 kHz"]],
  },
  {
    code: "F-02",
    title: "Adaptive Neuroplastic Core",
    text: "The system learns your neural signature, recalibrating hourly. Every day it fits you more perfectly than the day before.",
    metric: 88,
    metricLabel: "Adaptation index",
    specs: [["Model", "NX-Mind v7"], ["Params", "2.1 B"], ["Updates", "On-device"]],
  },
  {
    code: "F-03",
    title: "Augmented Perception",
    text: "Thermal, spectral and ultrasonic channels rendered straight into the visual cortex. See what the universe hides.",
    metric: 99,
    metricLabel: "Visual acuity gain",
    specs: [["Spectrum", "0.1 nm – 14 µm"], ["Zoom", "×120"], ["Night mode", "Native"]],
  },
  {
    code: "F-04",
    title: "Self-healing Biomechanics",
    text: "Nano-lattice joints repair micro-fractures autonomously. Skin-grade sensors feel pressure down to a single gram.",
    metric: 92,
    metricLabel: "Structural integrity",
    specs: [["Repair", "Autonomous"], ["Rating", "IP-69K"], ["Warranty", "50 yrs"]],
  },
];

const STATS = [
  { value: 0.4, suffix: "ms", decimals: 1, label: "Neural latency" },
  { value: 99.97, suffix: "%", decimals: 2, label: "Sync stability" },
  { value: 340, suffix: "%", decimals: 0, label: "Strength amplification" },
  { value: 12, suffix: "M+", decimals: 0, label: "Lives augmented" },
];

function Ring({ value }: { value: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 180 180" className="h-36 w-36 -rotate-90 md:h-44 md:w-44" aria-hidden>
      <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
      <motion.circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="4"
        strokeLinecap="square"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        initial={{ strokeDashoffset: c }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: "drop-shadow(0 0 6px #00f0ff)" }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Features() {
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();
  const imgWrap = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgWrap, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1.02]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count || "0");
        const dec = parseInt(el.dataset.dec || "0", 10);
        if (reduce) {
          el.textContent = end.toFixed(dec);
          return;
        }
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          onUpdate: () => (el.textContent = o.v.toFixed(dec)),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      if (!reduce) {
        gsap.from("[data-stat]", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        });
        gsap.from("[data-spec-line]", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        });
      }
    });
    return () => ctx.revert();
  }, [reduce]);

  const f = FEATURES[active];

  return (
    <section id="features" className="relative isolate bg-void py-28 md:py-40">
      <div aria-hidden className="absolute right-0 top-40 -z-10 h-[500px] w-[500px] rounded-full bg-violet-neon/15 blur-[140px]" />
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeader id="// 02" eyebrow="Capabilities" title={["ENGINEERED BEYOND", "BIOLOGY"]}>
          Four core capabilities. One seamless system. Scroll to explore — the diagnostic panel tracks each module as you read.
        </SectionHeader>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Sticky visual */}
          <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-8rem)] lg:self-start">
            <div ref={imgWrap} className="glass relative aspect-[4/5] max-h-full w-full overflow-hidden lg:aspect-auto lg:h-full">
              <HudCorners className="z-20" />
              <motion.img
                src={neural}
                alt="Illustration of neural pathways glowing in cyan and violet"
                loading="lazy"
                style={{ scale: imgScale }}
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-void/50" />
              <div className="scanline absolute inset-0" />
              <div className="scan-beam" />

              <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-neon" />
                <span className="label text-cyan-neon">Module diagnostics</span>
              </div>
              <div className="label absolute right-5 top-5 z-10 text-white/50">{f.code}</div>

              <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="label text-white/50">{f.metricLabel}</div>
                    <div className="mt-1 font-display text-5xl font-black text-white md:text-6xl">
                      {f.metric}
                      <span className="text-cyan-neon">%</span>
                    </div>
                    <div className="mt-3 max-w-[220px] font-display text-sm uppercase tracking-wider text-white/80">{f.title}</div>
                  </motion.div>
                </AnimatePresence>
                <div className="relative grid shrink-0 place-items-center">
                  <Ring value={f.metric} />
                  <span className="absolute font-mono text-xs text-cyan-neon">{String(active + 1).padStart(2, "0")}/04</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling feature list */}
          <div className="flex flex-col">
            {FEATURES.map((ft, i) => (
              <motion.article
                key={ft.code}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className={cn(
                  "border-t border-white/10 py-12 transition-opacity duration-500 lg:min-h-[60vh]",
                  active === i ? "opacity-100" : "opacity-40"
                )}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-6xl font-black text-outline md:text-7xl">0{i + 1}</span>
                  <span className="label text-cyan-neon">{ft.code}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-wide text-white md:text-4xl">{ft.title}</h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">{ft.text}</p>
                <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4">
                  {ft.specs.map(([k, v]) => (
                    <div key={k} className="border-l border-cyan-neon/40 pl-3">
                      <dt className="label text-white/40">{k}</dt>
                      <dd className="mt-1 font-mono text-sm font-bold text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-24 md:mt-32">
          <Reveal>
            <div className="mb-8 flex items-center gap-4">
              <span className="label text-cyan-neon">// Live telemetry</span>
              <span data-spec-line className="h-px flex-1 bg-gradient-to-r from-cyan-neon/60 to-transparent" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} data-stat className="group relative bg-void p-6 transition-colors hover:bg-charcoal md:p-10">
                <div className="font-display text-4xl font-black text-chrome transition-all group-hover:text-neon sm:text-5xl md:text-6xl">
                  <span data-count={s.value} data-dec={s.decimals}>
                    {reduce ? s.value : 0}
                  </span>
                  <span className="text-cyan-neon">{s.suffix}</span>
                </div>
                <div className="label mt-4 text-white/50">{s.label}</div>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-cyan-neon shadow-[0_0_10px_#00f0ff] transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
