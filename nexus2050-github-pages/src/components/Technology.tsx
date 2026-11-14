import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Atom, Bot, BrainCircuit, Cpu, Dna, Network, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HudCorners, SectionHeader, spotlightMove } from "./ui";
import { cn } from "@/utils/cn";

gsap.registerPlugin(ScrollTrigger);

type Viz = "neural" | "arcs" | "bars" | "gear" | "wave" | "helix";

const TECH: { id: string; icon: LucideIcon; title: string; text: string; spec: [string, string]; viz: Viz }[] = [
  {
    id: "T-01",
    icon: BrainCircuit,
    title: "Neural Interface Systems",
    text: "Lace-thin cortical arrays translate intention into signal at the speed of thought — read, write and remember without a screen.",
    spec: ["Bandwidth", "1.2 Tb/s"],
    viz: "neural",
  },
  {
    id: "T-02",
    icon: Cpu,
    title: "Cybernetic Enhancements",
    text: "Adaptive optics, reinforced skeletal lattices and myoelectric limbs that surpass biological limits, then learn your body.",
    spec: ["Strength gain", "+340%"],
    viz: "arcs",
  },
  {
    id: "T-03",
    icon: Network,
    title: "Artificial Intelligence Integration",
    text: "A personal intelligence that lives in your nervous system — anticipating, translating and protecting in real time.",
    spec: ["Inference", "48 TOPS"],
    viz: "bars",
  },
  {
    id: "T-04",
    icon: Bot,
    title: "Advanced Robotics",
    text: "Modular actuators and swarm-grade control systems that extend your reach into hazardous, microscopic, or orbital spaces.",
    spec: ["Precision", "±0.01 mm"],
    viz: "gear",
  },
  {
    id: "T-05",
    icon: Atom,
    title: "Human-Machine Synchronization",
    text: "Continuous bidirectional calibration keeps mind and machine in phase — one pulse, one perception, one self.",
    spec: ["Phase lock", "99.97%"],
    viz: "wave",
  },
  {
    id: "T-06",
    icon: Dna,
    title: "Biomechanical Engineering",
    text: "Self-healing synthetic tissue grown on living scaffolds, fusing organic cells with programmable smart materials.",
    spec: ["Regeneration", "6× faster"],
    viz: "helix",
  },
];

function Visual({ type }: { type: Viz }) {
  const c = "stroke-cyan-neon";
  switch (type) {
    case "neural": {
      const pts = [
        [20, 20], [70, 12], [120, 28], [45, 60], [95, 62], [145, 55], [30, 100], [80, 95], [130, 100],
      ];
      return (
        <svg viewBox="0 0 160 110" className="h-full w-full" fill="none" aria-hidden>
          {pts.map((a, i) =>
            pts.slice(i + 1).map((b, j) =>
              Math.hypot(a[0] - b[0], a[1] - b[1]) < 62 ? (
                <line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-cyan-neon/40" strokeWidth="0.6" />
              ) : null
            )
          )}
          {pts.map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r="3" className="fill-cyan-neon" style={{ animation: `node-pulse 1.${i + 2}s ease-in-out ${i * 0.2}s infinite alternate` }} />
          ))}
        </svg>
      );
    }
    case "arcs":
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" aria-hidden>
          <circle cx="60" cy="60" r="50" className="stroke-white/10" strokeWidth="1" />
          <g className="spin-slow origin-center" style={{ transformOrigin: "60px 60px" }}>
            <path d="M60 10a50 50 0 0 1 43 25" className={c} strokeWidth="2" />
            <path d="M10 60a50 50 0 0 1 25-43" className="stroke-violet-neon" strokeWidth="2" />
          </g>
          <g className="spin-rev" style={{ transformOrigin: "60px 60px" }}>
            <circle cx="60" cy="60" r="34" className="stroke-cyan-neon/60" strokeWidth="1" strokeDasharray="4 6" />
            <path d="M60 94a34 34 0 0 1-30-17" className="stroke-white" strokeWidth="2" />
          </g>
          <circle cx="60" cy="60" r="6" className="fill-cyan-neon" />
        </svg>
      );
    case "bars":
      return (
        <div className="flex h-full items-end justify-center gap-1.5 pb-2" aria-hidden>
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="w-2 origin-bottom bg-gradient-to-t from-violet-neon to-cyan-neon"
              style={{
                height: `${30 + ((i * 37) % 70)}%`,
                animation: `eq ${0.9 + (i % 5) * 0.25}s ease-in-out ${i * 0.07}s infinite alternate`,
              }}
            />
          ))}
        </div>
      );
    case "gear":
      return (
        <div className="grid h-full place-items-center" aria-hidden>
          <svg viewBox="0 0 100 100" className="spin-slow h-full" fill="none">
            <circle cx="50" cy="50" r="30" className={c} strokeWidth="2" strokeDasharray="10 5" />
            <circle cx="50" cy="50" r="20" className="stroke-white/50" strokeWidth="1" />
            <circle cx="50" cy="50" r="8" className="stroke-violet-neon" strokeWidth="2" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1="50" y1="12" x2="50" y2="20" className="stroke-cyan-neon" strokeWidth="3" transform={`rotate(${i * 30} 50 50)`} />
            ))}
          </svg>
        </div>
      );
    case "wave":
      return (
        <svg viewBox="0 0 200 80" className="h-full w-full" fill="none" preserveAspectRatio="none" aria-hidden>
          <path d="M0 40 Q 25 0 50 40 T 100 40 T 150 40 T 200 40" className="stroke-cyan-neon" strokeWidth="2" strokeDasharray="300" style={{ animation: "ecg-draw 3s linear infinite alternate" }} />
          <path d="M0 40 Q 25 80 50 40 T 100 40 T 150 40 T 200 40" className="stroke-violet-neon" strokeWidth="2" strokeDasharray="300" style={{ animation: "ecg-draw 3s linear 0.5s infinite alternate" }} />
        </svg>
      );
    case "helix":
      return (
        <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => {
            const x = 8 + i * 7.6;
            const y1 = 55 + Math.sin(i * 0.6) * 38;
            const y2 = 55 - Math.sin(i * 0.6) * 38;
            return (
              <g key={i}>
                <line x1={x} y1={y1} x2={x} y2={y2} className="stroke-white/15" strokeWidth="1" />
                <circle cx={x} cy={y1} r="3" className="fill-cyan-neon" style={{ animation: `node-pulse 1.${i % 9 + 1}s ease-in-out infinite alternate` }} />
                <circle cx={x} cy={y2} r="3" className="fill-violet-neon" />
              </g>
            );
          })}
        </svg>
      );
  }
}

export default function Technology() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-tech-card]", {
        opacity: 0,
        y: 80,
        rotateX: -12,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" className="relative isolate overflow-hidden bg-charcoal py-28 md:py-40">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(#000,transparent_80%)]" />
      <div aria-hidden className="absolute left-1/2 top-0 -z-10 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-neon to-transparent" />
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeader id="// 01" eyebrow="Core technologies" title={["SIX PILLARS OF", "AUGMENTATION"]}>
          Every system is engineered as one organism. Hover a module to wake it up.
        </SectionHeader>

        <div ref={root} className="grid gap-5 [perspective:1200px] md:grid-cols-2 lg:grid-cols-3">
          {TECH.map((t, i) => (
            <article
              key={t.id}
              data-tech-card
              onMouseMove={spotlightMove}
              className={cn(
                "glass spotlight group relative flex min-h-[380px] flex-col justify-between p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-neon/70 hover:shadow-[0_0_50px_-10px_rgba(0,240,255,0.5)]",
                i % 3 === 1 && "lg:mt-14"
              )}
            >
              <HudCorners className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <span className="label text-white/40">{t.id}</span>
                <t.icon className="text-cyan-neon transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" size={28} strokeWidth={1.4} />
              </div>

              <div className="my-6 h-28 opacity-50 transition-all duration-500 group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_10px_rgba(0,240,255,0.7))]">
                <Visual type={t.viz} />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-white">{t.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55 transition-colors group-hover:text-white/80">{t.text}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="label text-white/40">{t.spec[0]}</span>
                  <span className="flex items-center gap-2 font-mono text-sm font-bold text-cyan-neon">
                    {t.spec[1]}
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
