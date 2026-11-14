import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** Fade/slide reveal on scroll */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 32,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Masked line-by-line text reveal. Each string in `lines` is a line. */
export function SplitHeading({
  lines,
  className,
  lineClassNames = [],
  delay = 0,
  as: Tag = "h2",
  immediate = false,
}: {
  lines: string[];
  className?: string;
  lineClassNames?: string[];
  delay?: number;
  as?: "h1" | "h2" | "h3";
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView={immediate ? undefined : "show"}
      animate={immediate ? "show" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.12, delayChildren: delay }}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden>
          <motion.span
            className={cn("block", lineClassNames[i])}
            variants={{
              hidden: reduce ? { y: 0 } : { y: "110%", rotateX: -40, opacity: 0 },
              show: { y: 0, rotateX: 0, opacity: 1 },
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** HUD corner brackets */
export function HudCorners({ className, color = "border-cyan-neon" }: { className?: string; color?: string }) {
  const base = cn("absolute h-3 w-3 border-2 transition-all duration-300", color);
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(base, "left-0 top-0 border-b-0 border-r-0")} />
      <span className={cn(base, "right-0 top-0 border-b-0 border-l-0")} />
      <span className={cn(base, "bottom-0 left-0 border-r-0 border-t-0")} />
      <span className={cn(base, "bottom-0 right-0 border-l-0 border-t-0")} />
    </div>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  accent,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string[];
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-14 max-w-4xl md:mb-20">
      <Reveal>
        <div className="mb-6 flex items-center gap-4">
          <span className="label text-cyan-neon">{id}</span>
          <span className="h-px w-16 bg-gradient-to-r from-cyan-neon to-transparent" />
          <span className="label text-white/50">{eyebrow}</span>
        </div>
      </Reveal>
      <SplitHeading
        lines={title}
        lineClassNames={accent ? [] : []}
        className="font-display text-4xl font-black uppercase leading-[1.02] tracking-tight text-chrome sm:text-5xl md:text-6xl lg:text-7xl"
      />
      {children && (
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Pointer-tracking helper for .spotlight cards */
export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Mono({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cn("label", className)} style={style}>
      {children}
    </span>
  );
}
