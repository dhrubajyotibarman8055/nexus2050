import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./Navbar";

const NAV = [
  ["Home", "#home"],
  ["Technology", "#technology"],
  ["Features", "#features"],
  ["Interface", "#interface"],
  ["About", "#about"],
  ["Contact", "#contact"],
];
const SOCIAL = ["X / Twitter", "GitHub", "LinkedIn", "YouTube"];

export default function Footer() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (n: number) => String(n).padStart(2, "0");

  return (
    <footer className="relative border-t border-white/10 bg-void">
      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              Engineering the interface between human consciousness and machine intelligence. Neo-Tokyo · Zurich · Orbital Station 3.
            </p>
            <div className="glass mt-8 inline-flex items-center gap-3 px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="label text-white/70">All systems nominal</span>
              <span className="label text-cyan-neon">
                UPTIME {fmt(Math.floor(secs / 3600))}:{fmt(Math.floor((secs % 3600) / 60))}:{fmt(secs % 60)}
              </span>
            </div>
          </div>

          <nav aria-label="Footer">
            <div className="label mb-5 text-cyan-neon">// Navigate</div>
            <ul className="space-y-3">
              {NAV.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-cyan-neon transition-all group-hover:w-4" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="label mb-5 text-cyan-neon">// Transmit</div>
            <ul className="space-y-3">
              {SOCIAL.map((s) => (
                <li key={s}>
                  <a
                    href="#home"
                    aria-label={`${s} (placeholder link)`}
                    className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-white/60 transition-colors hover:border-cyan-neon hover:text-white"
                  >
                    {s}
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="label text-white/40">© 2050 NEXUS Cybernetics Corp. All rights reserved.</p>
          <p className="label text-white/30">Build 7.2.0 · Neural-safe · Human-verified</p>
        </div>
      </div>
      <div aria-hidden className="font-display pointer-events-none select-none overflow-hidden whitespace-nowrap text-center text-[17vw] font-black leading-[0.7] text-outline opacity-30">
        NEXUS
      </div>
    </footer>
  );
}
