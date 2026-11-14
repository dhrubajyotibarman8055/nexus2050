import { useEffect, useRef } from "react";

type Node = { x: number; y: number; layer: number; phase: number };
type Pulse = { a: number; b: number; t: number; speed: number };

const LAYERS = [4, 6, 8, 6, 4];

/** Interactive neural-network visualization. Nodes react to the pointer; pulses travel along synapses. */
export default function NeuralCanvas({
  color,
  accent,
  scanProgress,
  reduce,
}: {
  color: string;
  accent: string;
  scanProgress: number; // 0..1, -1 when idle
  reduce: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const props = useRef({ color, accent, scanProgress });
  props.current = { color, accent, scanProgress };

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0,
      h = 0,
      raf = 0,
      last = 0;
    const mouse = { x: -999, y: -999 };
    const nodes: Node[] = [];
    const edges: [number, number][] = [];
    const pulses: Pulse[] = [];

    const build = () => {
      nodes.length = 0;
      edges.length = 0;
      LAYERS.forEach((count, l) => {
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: (l + 0.5) / LAYERS.length,
            y: (i + 1) / (count + 1),
            layer: l,
            phase: Math.random() * Math.PI * 2,
          });
        }
      });
      nodes.forEach((a, i) =>
        nodes.forEach((b, j) => {
          if (b.layer === a.layer + 1 && Math.random() < 0.7) edges.push([i, j]);
        })
      );
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pos = (n: Node, t: number) => ({
      x: n.x * w + Math.sin(t * 0.0007 + n.phase) * 6,
      y: n.y * h + Math.cos(t * 0.0009 + n.phase) * 6,
    });

    const draw = (t: number) => {
      const { color: c, accent: ac, scanProgress: sp } = props.current;
      ctx.clearRect(0, 0, w, h);

      // edges
      ctx.lineWidth = 1;
      edges.forEach(([ai, bi]) => {
        const a = pos(nodes[ai], t);
        const b = pos(nodes[bi], t);
        ctx.strokeStyle = c + "26";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const a = pos(nodes[p.a], t);
        const b = pos(nodes[p.b], t);
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, ac);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
        if (p.t >= 1) {
          pulses.splice(i, 1);
          // chain onward
          const next = edges.filter(([s]) => s === p.b);
          if (next.length && Math.random() < 0.85) {
            const [s, e] = next[Math.floor(Math.random() * next.length)];
            pulses.push({ a: s, b: e, t: 0, speed: p.speed });
          }
        }
      }

      // nodes
      nodes.forEach((n) => {
        const { x, y } = pos(n, t);
        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const near = Math.max(0, 1 - d / 130);
        const scanned = sp >= 0 && n.x <= sp;
        const r = 3.5 + near * 5 + (scanned ? 1 : 0);
        if (near > 0 || scanned) {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
          g.addColorStop(0, (scanned ? ac : c) + "88");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = scanned ? ac : c;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#050505";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // scan line
      if (sp >= 0) {
        const sx = sp * w;
        const g = ctx.createLinearGradient(sx - 60, 0, sx, 0);
        g.addColorStop(0, "transparent");
        g.addColorStop(1, ac + "55");
        ctx.fillStyle = g;
        ctx.fillRect(sx - 60, 0, 60, h);
        ctx.fillStyle = ac;
        ctx.fillRect(sx - 1, 0, 2, h);
      }
    };

    const loop = (t: number) => {
      const dt = Math.min(t - last, 50);
      last = t;
      if (Math.random() < 0.09 && pulses.length < 26) {
        const e = edges.filter(([s]) => nodes[s].layer === 0);
        const [a, b] = e[Math.floor(Math.random() * e.length)];
        pulses.push({ a, b, t: 0, speed: 0.0007 + Math.random() * 0.0006 });
      }
      pulses.forEach((p) => (p.t = Math.min(1, p.t + p.speed * dt)));
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -999;
    };

    build();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={ref}
      className="h-full w-full touch-pan-y"
      role="img"
      aria-label="Interactive visualization of a neural network with signals travelling between nodes"
    />
  );
}
