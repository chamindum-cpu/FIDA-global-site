"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import { ArrowDown } from "lucide-react";

/* ─── Animated Globe ──────────────────────────────────────── */
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.42;

    ctx.clearRect(0, 0, W, H);
    const t = Date.now() / 1000;

    /* — outer glow atmosphere — */
    const atmo = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.35);
    atmo.addColorStop(0, "rgba(0,195,90,0.08)");
    atmo.addColorStop(0.5, "rgba(30,120,255,0.05)");
    atmo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
    ctx.fillStyle = atmo;
    ctx.fill();

    /* — sphere base gradient — */
    const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.05, cx, cy, R);
    grad.addColorStop(0, "rgba(20, 40, 60, 0.9)");
    grad.addColorStop(0.6, "rgba(8, 20, 40, 0.95)");
    grad.addColorStop(1, "rgba(0, 8, 20, 0.98)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    /* — helper: 3D point → 2D canvas  — */
    const project = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + t * 18) * (Math.PI / 180); // spin speed
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.sin(theta);
      return { x: cx + x, y: cy - y, z };
    };

    /* — latitude grid lines — */
    for (let lat = -75; lat <= 75; lat += 25) {
      ctx.beginPath();
      let first = true;
      for (let lon = 0; lon <= 360; lon += 3) {
        const p = project(lat, lon);
        if (p.z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(0,195,90,0.11)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    /* — longitude grid lines — */
    for (let lon = 0; lon < 360; lon += 25) {
      ctx.beginPath();
      let first = true;
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = project(lat, lon);
        if (p.z < 0) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = "rgba(30,130,255,0.09)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    /* — glowing node dots (city lights) — */
    const nodes = [
      { lat: 25.2, lon: 55.3 },  // Dubai
      { lat: -1.3, lon: 36.8 },  // Nairobi
      { lat: 51.5, lon: -0.1 },  // London
      { lat: 40.7, lon: -74.0 }, // New York
      { lat: 1.3,  lon: 103.8 }, // Singapore
      { lat: 52.4, lon: 4.9 },   // Amsterdam
      { lat: 19.1, lon: 72.9 },  // Mumbai
      { lat: -6.2, lon: 35.7 },  // Dar es Salaam
      { lat: 31.2, lon: 121.5},  // Shanghai
      { lat: 48.9, lon: 2.3 },   // Paris
    ];

    nodes.forEach((node, idx) => {
      const p = project(node.lat, node.lon);
      if (p.z < 0) return;

      // pulsing glow
      const pulse = 0.5 + 0.5 * Math.sin(t * 2 + idx * 1.2);

      // outer glow
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
      glow.addColorStop(0, `rgba(0,220,100,${0.35 * pulse})`);
      glow.addColorStop(1, "rgba(0,220,100,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,230,110,${0.7 + 0.3 * pulse})`;
      ctx.fill();
    });

    /* — arc connections between some nodes — */
    const arcs = [[0,1],[0,5],[1,2],[2,3],[4,8],[5,9],[3,9],[0,6]];
    arcs.forEach(([a, b]) => {
      const pa = project(nodes[a].lat, nodes[a].lon);
      const pb = project(nodes[b].lat, nodes[b].lon);
      if (pa.z < 0 || pb.z < 0) return;

      // animated dashed arc
      const dashOffset = (t * 40) % 20;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      const midx = (pa.x + pb.x) / 2;
      const midy = (pa.y + pb.y) / 2 - 20;
      ctx.quadraticCurveTo(midx, midy, pb.x, pb.y);
      ctx.strokeStyle = "rgba(0,200,100,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    });

    /* — equator highlight ring — */
    const eq = project(0, 90);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 195, 90, 0.06)";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* — specular highlight (top-left glint) — */
    const shine = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.35, cy - R * 0.35, R * 0.55);
    shine.addColorStop(0, "rgba(255,255,255,0.07)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    /* — orbiting ring — */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(t * 0.3);
    ctx.scale(1, 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.15, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(30,140,255,0.18)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // orbiting satellite dot
    const angle = t * 1.2;
    const sx = Math.cos(angle) * R * 1.15;
    const sy = Math.sin(angle) * R * 1.15;
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(80,180,255,0.9)";
    ctx.fill();
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={560}
      className="w-full max-w-[560px] h-auto"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

/* ─── Hero ────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[110vh] flex items-center overflow-hidden"
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[180px] -z-10 pointer-events-none" style={{ background: "var(--green)", opacity: 0.12 }} />
      <div className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full blur-[160px] -z-10 pointer-events-none" style={{ background: "var(--blue)", opacity: 0.10 }} />

      <motion.div
        style={{ opacity, scale }}
        className="container mx-auto px-6 relative z-10 pt-36 pb-20 grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* ── Left: Text ── */}
        <div className="flex flex-col items-start text-left space-y-8">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-white/10 text-[10px] font-bold text-primary uppercase tracking-[0.2em]"
          >
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--green)]" />
            Business Partner for Success &amp; Beyond
          </motion.div>

          {/* Main heading */}
          <div className="space-y-2">
            <div className="overflow-hidden">
              <motion.h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                {"Enterprise".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] flex gap-x-[0.2em]">
                <span className="flex">
                  {"Global".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block text-primary italic relative"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
                <span className="flex">
                  {"Optimum".split("").map((letter, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.6 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block text-white"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              </motion.h1>
            </div>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-secondary max-w-xl leading-relaxed font-medium"
          >
            Empower cutting-edge technologies for optimum performance through appropriate
            utilization of available technology, implementing the best global practices.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/solutions"
              className="gradient-green text-white px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-105 transition-smooth"
            >
              Explore Solutions
            </Link>
            <Link
              href="/about"
              className="glass border text-secondary dark:text-white px-8 py-4 rounded-full font-bold text-base hover:border-primary/40 transition-smooth"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Trust Row (stats strip) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-white/5 w-full"
          >
            {[
              { label: "500+", sub: "Clients" },
              { label: "12",   sub: "Countries" },
              { label: "15+",  sub: "Awards" },
              { label: "99.9%",sub: "Uptime SLA" },
            ].map((s) => (
              <div key={s.label} className="text-left group cursor-default">
                <div className="text-lg font-black text-white group-hover:text-primary transition-colors">
                  {s.label}
                </div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                  {s.sub}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Animated Globe ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex items-center justify-center relative"
        >
          {/* Ring halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute w-[105%] h-[105%] rounded-full border border-primary/10 border-dashed"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[115%] h-[115%] rounded-full border border-blue/8 border-dashed"
          />

          {/* "GLOBAL NETWORK" label floating above */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-bold text-primary/70 uppercase tracking-[0.3em] whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Global Network
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <Globe />

          {/* Floating data card — bottom left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="absolute -left-8 bottom-16 glass border border-white/10 rounded-2xl px-4 py-3 text-xs"
          >
            <div className="text-muted uppercase tracking-widest text-[9px] mb-1">Active Clients</div>
            <div className="text-white font-black text-lg leading-none">500<span className="text-primary">+</span></div>
            <div className="text-[9px] text-primary mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary inline-block animate-pulse" />
              12 countries
            </div>
          </motion.div>

          {/* Floating data card — top right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="absolute -right-4 top-20 glass border border-white/10 rounded-2xl px-4 py-3 text-xs"
          >
            <div className="text-muted uppercase tracking-widest text-[9px] mb-1">Uptime SLA</div>
            <div className="text-white font-black text-lg leading-none">99.9<span className="text-primary">%</span></div>
            <div className="text-[9px] text-primary mt-1 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-primary inline-block animate-pulse" />
              Always On
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-xs font-semibold uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
