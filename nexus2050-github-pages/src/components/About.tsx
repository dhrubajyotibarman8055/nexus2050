import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { MotionValue } from "framer-motion";
const cyborg = `${import.meta.env.BASE_URL}images/cyborg.png`;
import { Reveal } from "./ui";

const MANIFESTO =
  "We do not build machines to replace humanity. We build them to complete it. Every implant, every algorithm, every line of code is a bridge between who we are and who we are becoming. The body is the first technology — we are simply writing its next version.";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(progress, range, ["#6b7280", "#ffffff"]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

const TIMELINE = [
  ["2031", "First cortical lattice implanted", "A paralysed pilot types with thought alone."],
  ["2038", "Neural sync crosses 99%", "Mind and machine become indistinguishable in latency."],
  ["2044", "Open augmentation era", "Enhancement becomes a civil right, not a privilege."],
  ["2050", "The convergence", "A single species, extended across flesh and silicon."],
];

export default function About() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const bigX = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const { scrollYProgress: textP } = useScroll({ target: textRef, offset: ["start 0.85", "end 0.45"] });
  const words = MANIFESTO.split(" ");

  return (
    <section id="about" ref={ref} className="relative isolate overflow-hidden bg-void py-28 md:py-44">
      {/* parallax background */}
      <motion.div aria-hidden style={reduce ? undefined : { y: bgY }} className="absolute -right-[10%] top-0 -z-10 h-full w-[70%] min-w-[420px]">
        <img
          src={cyborg}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-25 grayscale-[40%] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"
        />
      </motion.div>
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(90deg,transparent,#000)]" />

      {/* giant scrolling outline word */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: bigX }}
        className="font-display pointer-events-none absolute left-0 top-10 -z-10 whitespace-nowrap text-[22vw] font-black leading-none text-outline opacity-40"
      >
        HUMAN × MACHINE × HUMAN × MACHINE
      </motion.div>

      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <span className="label text-cyan-neon">// 04</span>
            <span className="h-px w-16 bg-gradient-to-r from-cyan-neon to-transparent" />
            <span className="label text-white/50">The vision</span>
          </div>
        </Reveal>

        <p
          ref={textRef}
          className="max-w-6xl font-display text-[clamp(1.5rem,4.2vw,3.8rem)] font-bold uppercase leading-[1.18] tracking-tight"
          aria-label={MANIFESTO}
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} word={w} range={[start, end]} progress={textP} />;
          })}
        </p>

        <div className="mt-24 grid gap-px bg-white/10 md:mt-32 md:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map(([year, title, text], i) => (
            <Reveal key={year} delay={i * 0.1} className="group relative bg-void p-7 md:p-9">
              <div className="font-display text-5xl font-black text-outline transition-all duration-500 group-hover:text-neon group-hover:[-webkit-text-stroke:0] md:text-6xl">
                {year}
              </div>
              <div className="my-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-neon shadow-[0_0_10px_#00f0ff]" />
                <span className="h-px flex-1 bg-gradient-to-r from-cyan-neon/70 to-transparent" />
              </div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
