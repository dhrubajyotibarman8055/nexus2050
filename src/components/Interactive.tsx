import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Activity, Brain, Cpu, Eye, HeartPulse, ScanLine, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import NeuralCanvas from "./NeuralCanvas";
import { HudCorners, SectionHeader } from "./ui";
import { cn } from "@/utils/cn";

type ModKey = "neural" | "optic" | "core" | "motor";

const MODULES: Record<
  ModKey,
  { label: string; icon: LucideIcon; color: string; accent: string; desc: string; diag: [string, number][]; hot: { x: number; y: number } }
> = {
  neural: {
    label: "Neural",
    icon: Brain,
    color: "#00f0ff",
    accent: "#ffffff",
    desc: "Cortical lattice online. 4,096 channels streaming at 30 kHz.",
    diag: [["Cortical sync", 97], ["Synaptic load", 62], ["Memory index", 88], ["Signal noise", 6]],
    hot: { x: 50, y: 11 },
  },
  optic: {
    label: "Optic",
    icon: Eye,
    color: "#8b5cf6",
    accent: "#00f0ff",
    desc: "Multi-spectrum optics calibrated. Thermal and UV channels open.",
    diag: [["Focus lock", 99], ["Spectral range", 84], ["Retina map", 93], ["Glare filter", 71]],
    hot: { x: 54, y: 14 },
  },
  core: {
    label: "Core",
    icon: Cpu,
    color: "#00f0ff",
    accent: "#8b5cf6",
    desc: "Quantum core stable. Thermal envelope nominal at 41°C.",
    diag: [["Core clock", 91], ["Thermal load", 38], ["Energy cell", 76], ["Coherence", 98]],
    hot: { x: 50, y: 38 },
  },
  motor: {
    label: "Motor",
    icon: Zap,
    color: "#8b5cf6",
    accent: "#ffffff",
    desc: "Myoelectric actuators synchronized across 212 joints.",
    diag: [["Torque output", 82], ["Joint sync", 95], ["Fatigue index", 14], ["Calibration", 90]],
    hot: { x: 82, y: 36 },
  },
};

const KEYS = Object.keys(MODULES) as ModKey[];

const SCAN_LOG = [
  "> Initializing diagnostic sweep…",
  "> Handshake with cortical array … OK",
  "> Mapping synaptic pathways … 4,096 / 4,096",
  "> Verifying biomech integrity … 99.2%",
  "> Checking quantum core coherence … STABLE",
  "> Scan complete. 0 anomalies detected.",
];

function Ecg({ reduce }: { reduce: boolean }) {
  const path = useRef<SVGPathElement>(null);
  useEffect(() => {
    const N = 120;
    const buf = new Array(N).fill(0);
    const shape: Record<number, number> = { 2: 0.15, 3: 0.2, 4: 0.12, 8: -0.2, 9: 1, 10: -0.4, 16: 0.2, 17: 0.3, 18: 0.2 };
    let p = 0,
      raf = 0,
      last = 0;
    const render = () => {
      if (!path.current) return;
      path.current.setAttribute(
        "d",
        buf.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (N - 1)) * 200} ${30 - v * 24}`).join(" ")
      );
    };
    const step = (t: number) => {
      if (t - last > 40) {
        last = t;
        buf.shift();
        buf.push((shape[p % 28] ?? 0) + (Math.random() - 0.5) * 0.03);
        p++;
        render();
      }
      raf = requestAnimationFrame(step);
    };
    if (reduce) {
      for (let i = 0; i < N; i++) buf[i] = shape[i % 28] ?? 0;
      render();
    } else raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <svg viewBox="0 0 200 60" className="h-16 w-full" preserveAspectRatio="none" aria-hidden>
      <path ref={path} fill="none" stroke="#00f0ff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px #00f0ff)" }} />
    </svg>
  );
}

function Silhouette({ active, onSelect }: { active: ModKey; onSelect: (k: ModKey) => void }) {
  const reduce = !!useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 14 });

  return (
    <div
      className="relative h-full min-h-[300px] [perspective:900px]"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="absolute inset-0 [transform-style:preserve-3d]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" aria-hidden preserveAspectRatio="xMidYMid meet">
          <g stroke="#00f0ff" strokeWidth="0.35" opacity="0.8">
            <ellipse cx="50" cy="12" rx="7" ry="8.5" />
            <path d="M43 20 Q 30 24 26 34 L22 62 M57 20 Q 70 24 74 34 L78 62" />
            <path d="M38 24 L38 62 Q 38 66 42 66 L58 66 Q 62 66 62 62 L62 24" />
            <path d="M42 66 L40 96 M58 66 L60 96" />
            <path d="M38 38 H62 M38 50 H62" opacity="0.5" />
            <line x1="50" y1="21" x2="50" y2="66" opacity="0.5" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="8" y1={14 + i * 14} x2="92" y2={14 + i * 14} stroke="#00f0ff" opacity="0.07" />
            ))}
          </g>
          <circle cx="50" cy="50" r="46" stroke="#8b5cf6" strokeWidth="0.25" strokeDasharray="1.5 2.5" className="spin-slow" style={{ transformOrigin: "50px 50px" }} />
        </svg>
        {KEYS.map((k) => {
          const m = MODULES[k];
          const isActive = k === active;
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              aria-label={`Select ${m.label} module`}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.hot.x}%`, top: `${m.hot.y}%`, transform: "translate(-50%,-50%) translateZ(30px)" }}
            >
              <span className={cn("relative grid h-7 w-7 place-items-center rounded-full border transition-all", isActive ? "scale-110 border-cyan-neon bg-cyan-neon/20" : "border-white/40 hover:border-cyan-neon")}>
                <span className={cn("h-2 w-2 rounded-full", isActive ? "bg-cyan-neon" : "bg-white/60")} />
                {isActive && <span className="absolute inset-0 animate-ping rounded-full border border-cyan-neon" />}
              </span>
            </button>
          );
        })}
      </motion.div>
      <div className="scan-beam opacity-60" />
    </div>
  );
}

export default function Interactive() {
  const reduce = !!useReducedMotion();
  const [mod, setMod] = useState<ModKey>("neural");
  const [diag, setDiag] = useState<number[]>(MODULES.neural.diag.map((d) => d[1]));
  const [scan, setScan] = useState(-1);
  const [log, setLog] = useState<string[]>(["> Console ready. Select a module or run a full scan."]);
  const scanning = scan >= 0 && scan < 1;
  const timer = useRef<number | undefined>(undefined);

  const m = MODULES[mod];

  // reset diag when module changes
  useEffect(() => {
    setDiag(MODULES[mod].diag.map((d) => d[1]));
    setLog((l) => [...l.slice(-4), `> Module ${MODULES[mod].label.toUpperCase()} selected`]);
  }, [mod]);

  // live drift
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setDiag((d) => d.map((_, i) => Math.max(2, Math.min(100, MODULES[mod].diag[i][1] + (Math.random() - 0.5) * 6))));
    }, 1200);
    return () => clearInterval(id);
  }, [mod, reduce]);

  const runScan = useCallback(() => {
    if (scanning) return;
    setLog([SCAN_LOG[0]]);
    let p = 0;
    setScan(0);
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      p += 0.012;
      const idx = Math.min(SCAN_LOG.length - 1, Math.floor(p * SCAN_LOG.length));
      setLog((l) => (l[l.length - 1] === SCAN_LOG[idx] ? l : [...l.slice(-4), SCAN_LOG[idx]]));
      if (p >= 1) {
        window.clearInterval(timer.current);
        setScan(1);
        setLog((l) => (l[l.length - 1] === SCAN_LOG[SCAN_LOG.length - 1] ? l : [...l.slice(-4), SCAN_LOG[SCAN_LOG.length - 1]]));
        window.setTimeout(() => setScan(-1), 1800);
      } else setScan(p);
    }, 40);
  }, [scanning]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  return (
    <section id="interface" className="relative isolate overflow-hidden bg-charcoal py-28 md:py-40">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40" />
      <div aria-hidden className="absolute -left-40 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-neon/10 blur-[140px]" />
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeader id="// 03" eyebrow="Interactive experience" title={["ENTER THE", "NEURAL INTERFACE"]}>
          A live view of the augmentation stack. Select a module, move your cursor through the network, or run a full diagnostic sweep.
        </SectionHeader>

        <div className="glass relative overflow-hidden">
          <HudCorners />
          {/* title bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-neon" />
              </span>
              <span className="label text-white/60">NEXUS//OS · Diagnostic console v7.2</span>
            </div>
            <div role="tablist" aria-label="Augmentation modules" className="flex gap-1">
              {KEYS.map((k) => {
                const Icon = MODULES[k].icon;
                return (
                  <button
                    key={k}
                    role="tab"
                    aria-selected={mod === k}
                    onClick={() => setMod(k)}
                    className={cn(
                      "label flex items-center gap-2 border px-3 py-2 transition-all",
                      mod === k ? "border-cyan-neon bg-cyan-neon/10 text-cyan-neon" : "border-white/10 text-white/50 hover:border-white/40 hover:text-white"
                    )}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{MODULES[k].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr_300px]">
            {/* Diagnostics */}
            <div className="border-b border-white/10 p-5 md:p-6 lg:border-b-0 lg:border-r">
              <div className="label mb-5 flex items-center gap-2 text-cyan-neon">
                <Activity size={14} /> System diagnostics
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={mod} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6 min-h-[3.5rem] text-sm leading-relaxed text-white/60">
                  {m.desc}
                </motion.p>
              </AnimatePresence>
              <ul className="space-y-5">
                {m.diag.map(([label], i) => (
                  <li key={label}>
                    <div className="mb-2 flex justify-between">
                      <span className="label text-white/50">{label}</span>
                      <span className="font-mono text-xs font-bold text-white">{(diag[i] ?? 0).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10">
                      <div
                        className="h-full transition-[width] duration-1000 ease-out"
                        style={{ width: `${diag[i] ?? 0}%`, background: `linear-gradient(90deg, ${m.color}, #8b5cf6)`, boxShadow: `0 0 10px ${m.color}` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <button onClick={runScan} disabled={scanning} className="btn-neon mt-8 w-full justify-center disabled:opacity-60">
                <ScanLine size={16} />
                {scanning ? `Scanning ${Math.round(scan * 100)}%` : "Run full scan"}
              </button>
            </div>

            {/* Network */}
            <div className="relative flex min-h-[420px] flex-col border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="label absolute left-5 top-4 z-10 flex items-center gap-2 text-white/50">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-neon" />
                Neural network · live
              </div>
              <div className="label absolute right-5 top-4 z-10 text-white/40">L5 · 28 nodes</div>
              <div className="min-h-[340px] flex-1">
                <NeuralCanvas color={m.color} accent={m.accent} scanProgress={scan} reduce={reduce} />
              </div>
              <div aria-live="polite" className="h-[120px] overflow-hidden border-t border-white/10 bg-void/60 p-4 font-mono text-[11px] leading-relaxed text-cyan-neon/80">
                {log.map((l, i) => (
                  <div key={i + l} className={i === log.length - 1 ? "text-white" : "opacity-60"}>
                    {l}
                    {i === log.length - 1 && <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-cyan-neon" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Hologram + biometrics */}
            <div className="flex flex-col">
              <div className="relative flex-1 border-b border-white/10 p-4">
                <div className="label absolute left-5 top-4 z-10 text-white/50">Holographic body map</div>
                <Silhouette active={mod} onSelect={setMod} />
              </div>
              <div className="p-5">
                <div className="label mb-2 flex items-center justify-between text-white/50">
                  <span className="flex items-center gap-2">
                    <HeartPulse size={14} className="text-violet-neon" /> Biometrics
                  </span>
                  <span className="text-cyan-neon">LIVE</span>
                </div>
                <Ecg reduce={reduce} />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    ["BPM", "72"],
                    ["SpO₂", "99%"],
                    ["Temp", "36.6°"],
                  ].map(([k, v]) => (
                    <div key={k} className="border border-white/10 py-2">
                      <div className="font-mono text-sm font-bold text-white">{v}</div>
                      <div className="label !text-[0.55rem] text-white/40">{k}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
