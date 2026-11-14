import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Crosshair, Radio } from "lucide-react";
const cyborg = `${import.meta.env.BASE_URL}images/cyborg.png`;
import { HudCorners, SplitHeading } from "./ui";

const HeroScene = lazy(() => import("./HeroScene"));

function useLive(base: number, jitter: number, ms = 1400, digits = 1) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setV(base + (Math.random() - 0.5) * jitter), ms);
    return () => clearInterval(id);
  }, [base, jitter, ms]);
  return v.toFixed(digits);
}

function useMedia(q: string) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const f = () => setM(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [q]);
  return m;
}

export default function Hero() {
  const reduce = !!useReducedMotion();
  const mobile = useMedia("(max-width: 767px)");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // pointer tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [7, -7]), { stiffness: 80, damping: 15 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-9, 9]), { stiffness: 80, damping: 15 });
  const px = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(my, [-1, 1], [-10, 10]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, mx, my]);

  const sync = useLive(98.7, 1.2, 1300);
  const lat = useLive(35.6762, 0.0008, 900, 4);
  const lon = useLive(139.6503, 0.0008, 1100, 4);
  const bpm = useLive(72, 6, 900, 0);

  return (
    <section id="home" ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-void">
      {/* atmosphere */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_60%_45%,#000_10%,transparent_70%)]" />
        <div className="absolute -right-40 top-0 h-[70vh] w-[70vh] rounded-full bg-violet-neon/25 blur-[140px]" />
        <div className="absolute -left-32 bottom-0 h-[50vh] w-[50vh] rounded-full bg-cyan-neon/15 blur-[130px]" />
        <div className="scanline absolute inset-0 opacity-60" />
      </div>

      {/* 3D scene */}
      <div aria-hidden className="absolute inset-0 -z-[5]">
        <Suspense fallback={null}>
          <HeroScene reduce={reduce} mobile={mobile} />
        </Suspense>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-center px-5 pb-28 pt-28 md:px-10 lg:pt-20">
        {/* Cyborg figure */}
        <motion.div
          style={{ y: imgY, opacity: fade }}
          className="pointer-events-none relative z-0 mx-auto mb-[-10%] w-[74%] max-w-[560px] sm:mb-[-10%] lg:absolute lg:-right-4 lg:top-1/2 lg:mb-0 lg:w-[56%] lg:max-w-[820px] lg:-translate-y-1/2 xl:right-6"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9, filter: "blur(18px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: rx, rotateY: ry, x: px, y: py, transformPerspective: 1100 }}
            className="relative aspect-square"
          >
            <img
              src={cyborg}
              alt="Half-human, half-cybernetic humanoid with a glowing cyan optical implant"
              width={1100}
              height={1100}
              fetchPriority="high"
              className="h-full w-full object-cover [mask-image:radial-gradient(circle_at_50%_50%,#000_46%,transparent_72%)]"
            />
            {/* optic reticle */}
            <div className="absolute left-[66%] top-[39%] hidden -translate-x-1/2 -translate-y-1/2 sm:block" aria-hidden>
              <div className="spin-slow relative h-20 w-20 rounded-full border border-dashed border-cyan-neon/80 lg:h-28 lg:w-28">
                <span className="absolute -top-1 left-1/2 h-2 w-px bg-cyan-neon" />
              </div>
              <div className="absolute inset-3 rounded-full border border-cyan-neon/30" />
              <Crosshair className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-neon" size={18} />
              <div className="label absolute left-full top-1/2 ml-3 whitespace-nowrap text-cyan-neon">
                <span className="block">OPTIC-7 // LOCK</span>
                <span className="block text-white/50">4096 ppd · 0.4ms</span>
              </div>
            </div>
            <div className="scan-beam [mask-image:radial-gradient(circle,#000_40%,transparent_70%)]" />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 lg:max-w-[70%]">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-neon opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-neon" />
            </span>
            <span className="label text-cyan-neon">System online</span>
            <span className="h-px w-10 bg-white/20" />
            <span className="label text-white/50">Project NEXUS · Gen-7 Augmentation</span>
          </motion.div>

          <SplitHeading
            as="h1"
            immediate
            delay={0.35}
            lines={["THE FUTURE", "IS HUMAN.", "REDEFINED."]}
            lineClassNames={["text-chrome", "text-chrome", "text-neon"]}
            className="font-display text-[clamp(2.5rem,9.4vw,8.4rem)] font-black leading-[0.95] tracking-tighter [text-shadow:0_0_60px_rgba(0,240,255,0.12)]"
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-lg"
          >
            We merge flesh, silicon and intelligence into a single living system. Neural interfaces, adaptive
            exo-structures and synthetic cognition — engineered to extend what it means to be human.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href="#features" className="btn-neon">
              Explore the future <ArrowRight size={16} />
            </a>
            <a href="#technology" className="btn-ghost">
              Discover technology
            </a>
          </motion.div>
        </motion.div>

        {/* Floating HUD panels */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="relative z-10 mt-12 grid grid-cols-2 gap-3 sm:max-w-md lg:absolute lg:bottom-28 lg:right-10 lg:mt-0 lg:w-[300px] lg:grid-cols-1"
        >
          <div className="glass relative animate-float p-4">
            <HudCorners />
            <div className="label flex items-center justify-between text-white/50">
              <span>Neural sync</span>
              <Radio size={12} className="text-cyan-neon" />
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-white">
              {sync}
              <span className="text-cyan-neon">%</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden bg-white/10">
              <motion.div className="h-full bg-gradient-to-r from-cyan-neon to-violet-neon" animate={{ width: `${sync}%` }} />
            </div>
          </div>
          <div className="glass relative p-4 [animation:float_8s_ease-in-out_1s_infinite]">
            <HudCorners color="border-violet-neon" />
            <div className="label text-white/50">Coordinates</div>
            <div className="mt-2 font-mono text-xs leading-relaxed text-white/80">
              LAT {lat}° N<br />
              LON {lon}° E
            </div>
            <div className="label mt-2 text-violet-neon">BPM {bpm} · stable</div>
          </div>
        </motion.div>
      </div>

      {/* Side metadata */}
      <div aria-hidden className="label absolute left-5 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left text-white/30 xl:block">
        SCROLL TO SYNCHRONIZE · 01 / 07
      </div>

      <motion.a
        href="#technology"
        aria-label="Scroll to technology"
        style={{ opacity: fade }}
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 hover:text-cyan-neon md:flex"
      >
        <span className="label">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.a>

      {/* Ticker */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 overflow-hidden border-y border-white/10 bg-void/60 py-3 backdrop-blur">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="label flex gap-12 text-white/40">
              {[
                "NEURAL LINK // ACTIVE",
                "SYNAPTIC LATENCY 0.4MS",
                "BIOMECH INTEGRITY 99.2%",
                "QUANTUM CORE // STABLE",
                "AUGMENTATION GEN-7",
                "CONSCIOUSNESS BACKUP // SYNCED",
                "EXO-FRAME CALIBRATED",
              ].map((t) => (
                <span key={t + k} className="flex items-center gap-12">
                  {t}
                  <span className="text-cyan-neon">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
