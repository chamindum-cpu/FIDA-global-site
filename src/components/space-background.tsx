"use client";

import React, { useEffect, useRef, useMemo } from "react";

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dot   { x: number; y: number; r: number; baseAlpha: number; alpha: number; twinkleSpeed: number; twinklePhase: number; color: [number,number,number]; }
interface Orbit { cx: number; cy: number; rx: number; ry: number; angle: number; speed: number; r: number; color: string; moonAngle: number; moonSpeed: number; moonR: number; hasMoon: boolean; hasRing: boolean; ringColor: string; }
interface Streak { x: number; y: number; len: number; angle: number; alpha: number; speed: number; active: boolean; timer: number; cooldown: number; maxCooldown: number; }
interface ConLine { x1p: number; y1p: number; x2p: number; y2p: number; }
interface ConDot  { xp: number; yp: number; }
interface DustPt  { x: number; y: number; r: number; alpha: number; vx: number; vy: number; }

// ─── Build scene data (once) ──────────────────────────────────────────────────
function buildScene(W: number, H: number) {
  const R = rng(42);
  const cx = W / 2, cy = H / 2;

  // Stars — dots only
  const palette: Array<[number,number,number]> = [
    [255,255,255],[200,225,255],[255,220,190],[200,255,215],[255,210,255],[255,240,170],
  ];
  const stars: Dot[] = Array.from({ length: 280 }, () => {
    const base = 0.15 + R() * 0.7;
    return {
      x: R() * W, y: R() * H,
      r: R() * 1.8 + 0.3,
      baseAlpha: base, alpha: base,
      twinkleSpeed: 0.004 + R() * 0.012,
      twinklePhase: R() * Math.PI * 2,
      color: palette[Math.floor(R() * palette.length)],
    };
  });

  // Orbit planets
  const orbitDefs = [
    { rx: 140, ry: 40, speed: 0.0006, r: 5,  color: "#60a5fa", moonR: 2, moonDist: 12, hasMoon: true,  hasRing: false, ringColor: "" },
    { rx: 210, ry: 60, speed: 0.0004, r: 7,  color: "#34d399", moonR: 2, moonDist: 16, hasMoon: true,  hasRing: false, ringColor: "" },
    { rx: 290, ry: 82, speed: 0.00025,r: 9,  color: "#fb923c", moonR: 0, moonDist: 0,  hasMoon: false, hasRing: true,  ringColor: "#fbbf24" },
    { rx: 370, ry: 105,speed: 0.00015,r: 5,  color: "#94a3b8", moonR: 2, moonDist: 12, hasMoon: true,  hasRing: false, ringColor: "" },
    { rx: 450, ry: 128,speed: 0.0001, r: 7,  color: "#67e8f9", moonR: 0, moonDist: 0,  hasMoon: false, hasRing: true,  ringColor: "#22d3ee" },
  ];
  const orbits: Orbit[] = orbitDefs.map((o, i) => ({
    cx, cy, rx: o.rx, ry: o.ry,
    angle: (i / orbitDefs.length) * Math.PI * 2,
    speed: o.speed * (i % 2 === 0 ? 1 : -1),
    r: o.r, color: o.color,
    moonAngle: R() * Math.PI * 2,
    moonSpeed: 0.006,
    moonR: o.moonR,
    hasMoon: o.hasMoon,
    hasRing: o.hasRing,
    ringColor: o.ringColor,
  }));

  // Shooting streaks
  const streaks: Streak[] = Array.from({ length: 8 }, (_, i) => ({
    x: 0, y: 0, len: 80 + R() * 140, angle: 0.38 + R() * 0.3,
    alpha: 0, speed: 6 + R() * 8,
    active: false, timer: 0,
    cooldown: 0, maxCooldown: 180 + i * 90 + R() * 300,
  }));

  // Constellation lines
  const constellations = [
    [[0.08,0.12],[0.11,0.08],[0.15,0.14],[0.12,0.18],[0.08,0.12]],
    [[0.72,0.08],[0.76,0.05],[0.80,0.10],[0.77,0.15],[0.73,0.12],[0.72,0.08]],
    [[0.20,0.75],[0.24,0.70],[0.28,0.74],[0.25,0.80]],
    [[0.55,0.22],[0.58,0.18],[0.62,0.24],[0.65,0.20],[0.60,0.28],[0.55,0.22]],
  ];
  const conLines: ConLine[] = [];
  const conDots: ConDot[] = [];
  for (const pts of constellations) {
    for (let i = 0; i < pts.length - 1; i++) {
      conLines.push({ x1p: pts[i][0], y1p: pts[i][1], x2p: pts[i+1][0], y2p: pts[i+1][1] });
    }
    for (const p of pts) conDots.push({ xp: p[0], yp: p[1] });
  }

  // Asteroid belt dots
  const R2 = rng(77);
  const asteroids: { x: number; y: number; r: number; alpha: number }[] = Array.from({ length: 100 }, (_, i) => {
    const a = (i / 100) * Math.PI * 2 + (R2() - 0.5) * 0.18;
    const dist = 320 + (R2() - 0.5) * 50;
    return {
      x: cx + Math.cos(a) * dist,
      y: cy + Math.sin(a) * dist * 0.28,
      r: 0.5 + R2() * 1.5,
      alpha: 0.15 + R2() * 0.45,
    };
  });

  // Floating dust
  const R3 = rng(99);
  const dust: DustPt[] = Array.from({ length: 55 }, () => ({
    x: R3() * W, y: R3() * H,
    r: 0.8 + R3() * 2,
    alpha: 0.04 + R3() * 0.12,
    vx: (R3() - 0.5) * 0.18,
    vy: (R3() - 0.5) * 0.12,
  }));

  return { stars, orbits, streaks, conLines, conDots, asteroids, dust, cx, cy };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const tickRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Build scene once
    let scene = buildScene(W(), H());
    window.addEventListener("resize", () => { scene = buildScene(W(), H()); });

    // Sun pulse state
    let sunPulse = 0;

    // ── Draw helpers ──────────────────────────────────────────────────────────
    function drawCircle(x: number, y: number, r: number, color: string, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawGlow(x: number, y: number, r: number, color: string, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawOrbitEllipse(cx: number, cy: number, rx: number, ry: number) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "rgba(148,163,184,1)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    function frame() {
      tickRef.current++;
      const t = tickRef.current;

      // Skip every other frame → ~30fps on 60Hz screens
      if (t % 2 !== 0) { frameRef.current = requestAnimationFrame(frame); return; }

      const w = W(), h = H();
      ctx.fillStyle = "#010610";
      ctx.fillRect(0, 0, w, h);

      // ── 1. Static nebula blobs (drawn cheaply each frame) ──
      const nebs = [
        { x: w * 0.08,  y: h * 0.10, r: w * 0.28, c: "rgba(56,189,248,", a: 0.055 },
        { x: w * 0.78,  y: h * 0.55, r: w * 0.26, c: "rgba(20,184,166,",  a: 0.045 },
        { x: w * 0.55,  y: h * 0.08, r: w * 0.22, c: "rgba(139,92,246,",  a: 0.035 },
        { x: w * 0.18,  y: h * 0.72, r: w * 0.20, c: "rgba(251,113,133,", a: 0.03  },
        { x: w * 0.50,  y: h * 0.82, r: w * 0.18, c: "rgba(251,191,36,",  a: 0.025 },
      ];
      for (const n of nebs) {
        const pulse = Math.sin(t * 0.003 + n.x) * 0.012 + n.a;
        ctx.save();
        ctx.filter = "blur(60px)";
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.c + pulse + ")");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        ctx.filter = "none";
        ctx.restore();
      }

      // ── 2. Constellation lines ──
      ctx.save();
      ctx.strokeStyle = "rgba(200,220,255,0.18)";
      ctx.lineWidth = 0.6;
      ctx.setLineDash([3, 5]);
      for (const l of scene.conLines) {
        ctx.globalAlpha = 0.12 + Math.sin(t * 0.008 + l.x1p * 10) * 0.08;
        ctx.beginPath();
        ctx.moveTo(l.x1p * w, l.y1p * h);
        ctx.lineTo(l.x2p * w, l.y2p * h);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // constellation dots
      for (const d of scene.conDots) {
        const pulse = 0.55 + Math.sin(t * 0.01 + d.xp * 20) * 0.35;
        drawCircle(d.xp * w, d.yp * h, 1.8, "rgba(210,230,255,1)", pulse);
      }

      // ── 3. Stars (twinkle via sin) ──
      for (const s of scene.stars) {
        s.alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.twinklePhase) * (s.baseAlpha * 0.55);
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, s.alpha);
        ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // occasional subtle glow
        if (s.r > 1.4) {
          drawGlow(s.x, s.y, s.r * 5, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},1)`, s.alpha * 0.2);
        }
      }

      // ── 4. Floating dust ──
      for (const d of scene.dust) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        drawCircle(d.x, d.y, d.r, "rgba(180,210,255,1)", d.alpha + Math.sin(t * 0.007 + d.x) * 0.04);
      }

      // ── 5. Orbit ellipses ──
      const { cx, cy } = scene;
      for (const o of scene.orbits) {
        drawOrbitEllipse(cx, cy, o.rx, o.ry);
      }
      // Asteroid belt ring
      drawOrbitEllipse(cx, cy, 320, 90);

      // ── 6. Asteroid dots ──
      for (const a of scene.asteroids) {
        drawCircle(a.x, a.y, a.r, "rgba(148,163,184,1)", a.alpha);
      }

      // ── 7. Sun ──
      sunPulse = Math.sin(t * 0.025) * 0.15 + 0.85;
      // outer corona
      drawGlow(cx, cy, 120 * sunPulse, "rgba(251,191,36,1)", 0.06);
      drawGlow(cx, cy, 60  * sunPulse, "rgba(251,191,36,1)", 0.12);
      drawGlow(cx, cy, 28  * sunPulse, "rgba(253,224,71,1)",  0.55);
      // core dot
      drawCircle(cx, cy, 11 * sunPulse, "#fef08a", 1);
      // 4 subtle flare spikes
      ctx.save();
      ctx.globalAlpha = 0.18 + Math.sin(t * 0.018) * 0.08;
      ctx.strokeStyle = "rgba(253,224,71,1)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 0.003;
        const len = 22 + Math.sin(t * 0.02 + i) * 8;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 13, cy + Math.sin(a) * 13);
        ctx.lineTo(cx + Math.cos(a) * (13 + len), cy + Math.sin(a) * (13 + len));
        ctx.stroke();
      }
      ctx.restore();

      // ── 8. Orbit planets ──
      for (const o of scene.orbits) {
        o.angle += o.speed;
        const px = o.cx + Math.cos(o.angle) * o.rx;
        const py = o.cy + Math.sin(o.angle) * o.ry;

        // ring (before planet)
        if (o.hasRing) {
          ctx.save();
          ctx.globalAlpha = 0.35;
          ctx.strokeStyle = o.ringColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(px, py, o.r * 2.2, o.r * 0.55, o.angle + 0.4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // planet glow + dot
        drawGlow(px, py, o.r * 5, o.color, 0.25);
        drawCircle(px, py, o.r, o.color, 1);
        // shine
        drawCircle(px - o.r * 0.28, py - o.r * 0.28, o.r * 0.35, "rgba(255,255,255,1)", 0.35);

        // moon
        if (o.hasMoon && o.moonR > 0) {
          o.moonAngle += o.moonSpeed;
          const md = o.r * 2.8;
          const mx2 = px + Math.cos(o.moonAngle) * md;
          const my2 = py + Math.sin(o.moonAngle) * md * 0.5;
          drawCircle(mx2, my2, o.moonR, "rgba(203,213,225,1)", 0.85);
        }
      }

      // ── 9. Special objects (dot-style) ──
      // Black hole — event horizon dot + ring
      const bhX = w * 0.82, bhY = h * 0.18;
      drawGlow(bhX, bhY, 38, "rgba(251,191,36,1)", 0.18);
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(bhX, bhY, 22, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      // Accretion streak (rotating)
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "rgba(251,191,36,1)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(bhX, bhY, 30, 8, t * 0.012, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      drawCircle(bhX, bhY, 10, "#000", 1);
      drawCircle(bhX, bhY, 6, "#050505", 1);

      // Pulsar dots
      const pulsars = [{ x: w * 0.88, y: h * 0.52 }, { x: w * 0.31, y: h * 0.87 }, { x: w * 0.63, y: h * 0.91 }];
      for (const [i, p] of pulsars.entries()) {
        const beat = (Math.sin(t * (0.14 + i * 0.05)) + 1) / 2;
        drawCircle(p.x, p.y, 3, "rgb(199,210,254)", beat);
        drawGlow(p.x, p.y, 18 + beat * 22, "rgba(129,140,248,1)", beat * 0.35);
        // pulse ring
        const ring = (t * 0.08 + i * 2) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - ring) * 0.35;
        ctx.strokeStyle = "rgba(199,210,254,1)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(p.x, p.y, ring * 28, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      // Wormhole rings
      const whX = w * 0.11, whY = h * 0.64;
      for (const [i, r] of [32, 24, 16, 9].entries()) {
        const spin = t * 0.008 * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.globalAlpha = 0.3 - i * 0.05;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(139,92,246,1)" : "rgba(56,189,248,1)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(whX, whY, r, spin, spin + Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      drawGlow(whX, whY, 16, "rgba(167,139,250,1)", 0.4 + Math.sin(t * 0.02) * 0.15);
      drawCircle(whX, whY, 3, "rgba(196,181,253,1)", 0.85);

      // Binary stars
      const binaryPairs = [{ x: w * 0.24, y: h * 0.19 }, { x: w * 0.67, y: h * 0.79 }, { x: w * 0.45, y: h * 0.06 }];
      for (const b of binaryPairs) {
        const ba = t * 0.008;
        const d = 14;
        drawGlow(b.x + Math.cos(ba) * d, b.y + Math.sin(ba) * d * 0.5, 10, "rgba(251,191,36,1)", 0.35);
        drawCircle(b.x + Math.cos(ba) * d, b.y + Math.sin(ba) * d * 0.5, 3.5, "#fde047", 1);
        drawGlow(b.x - Math.cos(ba) * d, b.y - Math.sin(ba) * d * 0.5, 9, "rgba(139,92,246,1)", 0.35);
        drawCircle(b.x - Math.cos(ba) * d, b.y - Math.sin(ba) * d * 0.5, 2.8, "#c4b5fd", 1);
      }

      // Space station (drifts)
      const ssX = w * 0.60 + Math.sin(t * 0.006) * 18;
      const ssY = h * 0.28 + Math.cos(t * 0.004) * 10;
      ctx.save();
      ctx.translate(ssX, ssY);
      ctx.rotate(Math.sin(t * 0.005) * 0.12);
      ctx.globalAlpha = 0.8;
      // solar panels
      ctx.fillStyle = "rgba(96,165,250,0.7)";
      ctx.fillRect(-18, -2, 10, 3);
      ctx.fillRect(8,   -2, 10, 3);
      ctx.fillRect(-18, 2,  10, 3);
      ctx.fillRect(8,   2,  10, 3);
      // hub
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
      // blink
      const blink = Math.sin(t * 0.06) > 0 ? 0.9 : 0.1;
      drawCircle(0, -7, 1.5, "rgba(248,113,113,1)", blink);
      ctx.restore();

      // Satellites
      const sats = [
        { xp: 0.35, yp: 0.42, speed: 0.0003, phase: 0 },
        { xp: 0.72, yp: 0.30, speed: 0.0002, phase: 1 },
        { xp: 0.15, yp: 0.60, speed: 0.00025,phase: 2.5 },
      ];
      for (const s of sats) {
        const sx = (s.xp + Math.cos(t * s.speed + s.phase) * 0.18) * w;
        const sy = (s.yp + Math.sin(t * s.speed * 0.7 + s.phase) * 0.08) * h;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(t * 0.015 + s.phase);
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "#64748b";
        ctx.fillRect(-3, -1.5, 6, 3);
        ctx.fillStyle = "rgba(96,165,250,0.85)";
        ctx.fillRect(-8, -1, 4, 2);
        ctx.fillRect(4, -1, 4, 2);
        ctx.restore();
      }

      // ── 10. Shooting streaks ──
      for (const s of scene.streaks) {
        if (!s.active) {
          s.cooldown++;
          if (s.cooldown >= s.maxCooldown) {
            s.active = true; s.cooldown = 0; s.timer = 0;
            s.x = Math.random() * w * 0.85; s.y = Math.random() * h * 0.55;
            s.alpha = 1;
          }
        } else {
          s.timer += s.speed;
          s.alpha = Math.max(0, 1 - s.timer / s.len);
          const ex = s.x + Math.cos(s.angle) * s.timer;
          const ey = s.y + Math.sin(s.angle) * s.timer;
          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, `rgba(255,255,255,${s.alpha * 0.8})`);
          grad.addColorStop(1, `rgba(200,240,255,${s.alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.restore();
          if (s.alpha <= 0) { s.active = false; s.maxCooldown = 200 + Math.random() * 400; }
        }
      }

      // ── 11. Vignette ──
      const vig = ctx.createRadialGradient(w/2, h/2, h * 0.25, w/2, h/2, h * 0.9);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,2,10,0.78)");
      ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);

      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full pointer-events-none"
      style={{ display: "block" }}
    />
  );
}