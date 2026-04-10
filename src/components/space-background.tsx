"use client";

import React, { useEffect, useRef, useState } from "react";

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
interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: [number, number, number];
  parallaxFactor: number;
}
interface Orbit {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angle: number;
  speed: number;
  r: number;
  color: string;
  moonAngle: number;
  moonSpeed: number;
  moonR: number;
  hasMoon: boolean;
  hasRing: boolean;
  ringColor: string;
  atmosphereColor?: string;
  craterCount?: number;
}
interface Streak {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  len: number;
  angle: number;
  alpha: number;
  speed: number;
  active: boolean;
  timer: number;
  cooldown: number;
  maxCooldown: number;
  color: string;
  parallaxFactor: number;
}
interface ConLine {
  x1p: number;
  y1p: number;
  x2p: number;
  y2p: number;
}
interface ConDot {
  xp: number;
  yp: number;
  parallaxFactor: number;
}
interface DustPt {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  alpha: number;
  vx: number;
  vy: number;
  parallaxFactor: number;
}
interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tailLength: number;
  active: boolean;
  respawnTimer: number;
}
interface Nebula {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  r: number;
  c: string;
  a: number;
  pulseSpeed: number;
  swirl: number;
  parallaxFactor: number;
}

// ─── Build scene data (once) ──────────────────────────────────────────────────
function buildScene(W: number, H: number) {
  const R = rng(42);
  const cx = W / 2,
    cy = H / 2;

  // Stars — more variety with parallax
  const palette: Array<[number, number, number]> = [
    [255, 255, 255],
    [200, 225, 255],
    [255, 220, 190],
    [200, 255, 215],
    [255, 210, 255],
    [255, 240, 170],
    [180, 200, 255],
    [255, 200, 200],
  ];
  const stars: Dot[] = Array.from({ length: 350 }, () => {
    const base = 0.15 + R() * 0.75;
    const x = R() * W;
    const y = R() * H;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      r: R() * 2.2 + 0.3,
      baseAlpha: base,
      alpha: base,
      twinkleSpeed: 0.003 + R() * 0.015,
      twinklePhase: R() * Math.PI * 2,
      color: palette[Math.floor(R() * palette.length)],
      parallaxFactor: 0.02 + R() * 0.08, // Different depths
    };
  });

  // Orbit planets with more detail
  const orbitDefs = [
    {
      rx: 140,
      ry: 40,
      speed: 0.0006,
      r: 5,
      color: "#60a5fa",
      atmosphereColor: "rgba(96,165,250,0.3)",
      moonR: 2,
      moonDist: 12,
      hasMoon: true,
      hasRing: false,
      ringColor: "",
      craterCount: 0,
    },
    {
      rx: 210,
      ry: 60,
      speed: 0.0004,
      r: 7,
      color: "#34d399",
      atmosphereColor: "rgba(52,211,153,0.25)",
      moonR: 2,
      moonDist: 16,
      hasMoon: true,
      hasRing: false,
      ringColor: "",
      craterCount: 3,
    },
    {
      rx: 290,
      ry: 82,
      speed: 0.00025,
      r: 9,
      color: "#fb923c",
      atmosphereColor: "",
      moonR: 0,
      moonDist: 0,
      hasMoon: false,
      hasRing: true,
      ringColor: "#fbbf24",
      craterCount: 0,
    },
    {
      rx: 370,
      ry: 105,
      speed: 0.00015,
      r: 5,
      color: "#94a3b8",
      atmosphereColor: "",
      moonR: 2,
      moonDist: 12,
      hasMoon: true,
      hasRing: false,
      ringColor: "",
      craterCount: 5,
    },
    {
      rx: 450,
      ry: 128,
      speed: 0.0001,
      r: 7,
      color: "#67e8f9",
      atmosphereColor: "rgba(103,232,249,0.2)",
      moonR: 0,
      moonDist: 0,
      hasMoon: false,
      hasRing: true,
      ringColor: "#22d3ee",
      craterCount: 0,
    },
  ];
  const orbits: Orbit[] = orbitDefs.map((o, i) => ({
    cx,
    cy,
    rx: o.rx,
    ry: o.ry,
    angle: (i / orbitDefs.length) * Math.PI * 2,
    speed: o.speed * (i % 2 === 0 ? 1 : -1),
    r: o.r,
    color: o.color,
    atmosphereColor: o.atmosphereColor,
    moonAngle: R() * Math.PI * 2,
    moonSpeed: 0.006,
    moonR: o.moonR,
    hasMoon: o.hasMoon,
    hasRing: o.hasRing,
    ringColor: o.ringColor,
    craterCount: o.craterCount,
  }));

  // Shooting streaks with color variety and parallax
  const streakColors = [
    "rgba(255,255,255,",
    "rgba(200,240,255,",
    "rgba(255,220,200,",
    "rgba(200,255,220,",
  ];
  const streaks: Streak[] = Array.from({ length: 12 }, (_, i) => {
    const x = 0;
    const y = 0;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      len: 80 + R() * 160,
      angle: 0.38 + R() * 0.35,
      alpha: 0,
      speed: 5 + R() * 10,
      active: false,
      timer: 0,
      cooldown: 0,
      maxCooldown: 150 + i * 80 + R() * 350,
      color: streakColors[Math.floor(R() * streakColors.length)],
      parallaxFactor: 0.03 + R() * 0.05,
    };
  });

  // Enhanced constellation lines
  const constellations = [
    [
      [0.08, 0.12],
      [0.11, 0.08],
      [0.15, 0.14],
      [0.12, 0.18],
      [0.08, 0.12],
    ],
    [
      [0.72, 0.08],
      [0.76, 0.05],
      [0.8, 0.1],
      [0.77, 0.15],
      [0.73, 0.12],
      [0.72, 0.08],
    ],
    [
      [0.2, 0.75],
      [0.24, 0.7],
      [0.28, 0.74],
      [0.25, 0.8],
    ],
    [
      [0.55, 0.22],
      [0.58, 0.18],
      [0.62, 0.24],
      [0.65, 0.2],
      [0.6, 0.28],
      [0.55, 0.22],
    ],
    [
      [0.85, 0.65],
      [0.88, 0.62],
      [0.91, 0.68],
      [0.89, 0.72],
    ],
    [
      [0.42, 0.52],
      [0.45, 0.48],
      [0.48, 0.54],
      [0.46, 0.58],
      [0.42, 0.52],
    ],
  ];
  const conLines: ConLine[] = [];
  const conDots: ConDot[] = [];
  for (const pts of constellations) {
    for (let i = 0; i < pts.length - 1; i++) {
      conLines.push({
        x1p: pts[i][0],
        y1p: pts[i][1],
        x2p: pts[i + 1][0],
        y2p: pts[i + 1][1],
      });
    }
    for (const p of pts)
      conDots.push({ xp: p[0], yp: p[1], parallaxFactor: 0.01 + R() * 0.03 });
  }

  // Asteroid belt with more variation
  const R2 = rng(77);
  const asteroids: { x: number; y: number; r: number; alpha: number }[] =
    Array.from({ length: 140 }, (_, i) => {
      const a = (i / 140) * Math.PI * 2 + (R2() - 0.5) * 0.2;
      const dist = 320 + (R2() - 0.5) * 65;
      return {
        x: cx + Math.cos(a) * dist,
        y: cy + Math.sin(a) * dist * 0.28,
        r: 0.4 + R2() * 2,
        alpha: 0.12 + R2() * 0.5,
      };
    });

  // Floating dust with more particles and parallax
  const R3 = rng(99);
  const dust: DustPt[] = Array.from({ length: 75 }, () => {
    const x = R3() * W;
    const y = R3() * H;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      r: 0.6 + R3() * 2.5,
      alpha: 0.03 + R3() * 0.14,
      vx: (R3() - 0.5) * 0.22,
      vy: (R3() - 0.5) * 0.15,
      parallaxFactor: 0.05 + R3() * 0.15,
    };
  });

  // Comets
  const R4 = rng(123);
  const comets: Comet[] = Array.from({ length: 3 }, () => ({
    x: R4() * W,
    y: -50,
    vx: (R4() - 0.5) * 2,
    vy: 1.5 + R4() * 2,
    tailLength: 40 + R4() * 60,
    active: false,
    respawnTimer: R4() * 600,
  }));

  // Enhanced nebulae with parallax
  const nebulae: Nebula[] = [
    {
      x: W * 0.08,
      y: H * 0.1,
      baseX: W * 0.08,
      baseY: H * 0.1,
      r: W * 0.28,
      c: "rgba(56,189,248,",
      a: 0.055,
      pulseSpeed: 0.003,
      swirl: 0.0008,
      parallaxFactor: 0.03,
    },
    {
      x: W * 0.78,
      y: H * 0.55,
      baseX: W * 0.78,
      baseY: H * 0.55,
      r: W * 0.26,
      c: "rgba(20,184,166,",
      a: 0.045,
      pulseSpeed: 0.0025,
      swirl: -0.0006,
      parallaxFactor: 0.025,
    },
    {
      x: W * 0.55,
      y: H * 0.08,
      baseX: W * 0.55,
      baseY: H * 0.08,
      r: W * 0.22,
      c: "rgba(139,92,246,",
      a: 0.035,
      pulseSpeed: 0.004,
      swirl: 0.001,
      parallaxFactor: 0.04,
    },
    {
      x: W * 0.18,
      y: H * 0.72,
      baseX: W * 0.18,
      baseY: H * 0.72,
      r: W * 0.2,
      c: "rgba(251,113,133,",
      a: 0.03,
      pulseSpeed: 0.0028,
      swirl: -0.0007,
      parallaxFactor: 0.02,
    },
    {
      x: W * 0.5,
      y: H * 0.82,
      baseX: W * 0.5,
      baseY: H * 0.82,
      r: W * 0.18,
      c: "rgba(251,191,36,",
      a: 0.025,
      pulseSpeed: 0.0035,
      swirl: 0.0009,
      parallaxFactor: 0.015,
    },
  ];

  return {
    stars,
    orbits,
    streaks,
    conLines,
    conDots,
    asteroids,
    dust,
    comets,
    nebulae,
    cx,
    cy,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tickRef = useRef<number>(0);

  // Mouse position state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // Build scene once
    let scene = buildScene(W(), H());
    window.addEventListener("resize", () => {
      scene = buildScene(W(), H());
    });

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize to -1 to 1 range
      targetMouseRef.current = {
        x: ((x / W()) - 0.5) * 2,
        y: ((y / H()) - 0.5) * 2,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Sun pulse state
    let sunPulse = 0;
    let solarFlareTimer = 0;

    // ── Draw helpers ──────────────────────────────────────────────────────────
    function drawCircle(
      x: number,
      y: number,
      r: number,
      color: string,
      alpha: number
    ) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawGlow(
      x: number,
      y: number,
      r: number,
      color: string,
      alpha: number
    ) {
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

    function drawOrbitEllipse(
      cx: number,
      cy: number,
      rx: number,
      ry: number
    ) {
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
      if (t % 2 !== 0) {
        frameRef.current = requestAnimationFrame(frame);
        return;
      }

      const w = W(),
        h = H();

      // Smooth mouse movement (lerp)
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.05;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.05;

      const mouseX = currentMouseRef.current.x;
      const mouseY = currentMouseRef.current.y;

      ctx.fillStyle = "#010610";
      ctx.fillRect(0, 0, w, h);

      // ── 1. Enhanced nebula blobs with swirl and parallax ──
      for (const n of scene.nebulae) {
        const pulse = Math.sin(t * n.pulseSpeed + n.baseX * 0.01) * 0.015 + n.a;
        const swirlOffset = Math.sin(t * n.swirl) * 30;

        // Apply parallax
        n.x = n.baseX - mouseX * n.parallaxFactor * 50;
        n.y = n.baseY - mouseY * n.parallaxFactor * 50;

        ctx.save();
        ctx.filter = "blur(70px)";
        const g = ctx.createRadialGradient(
          n.x + swirlOffset,
          n.y,
          0,
          n.x,
          n.y,
          n.r
        );
        g.addColorStop(0, n.c + pulse + ")");
        g.addColorStop(0.6, n.c + pulse * 0.5 + ")");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.filter = "none";
        ctx.restore();
      }

      // ── 2. Distant galaxies ──
      const galaxies = [
        { x: w * 0.92, y: h * 0.25, r: 15, parallax: 0.02 },
        { x: w * 0.05, y: h * 0.18, r: 12, parallax: 0.015 },
        { x: w * 0.88, y: h * 0.88, r: 10, parallax: 0.025 },
      ];
      for (const gal of galaxies) {
        const galX = gal.x - mouseX * gal.parallax * 30;
        const galY = gal.y - mouseY * gal.parallax * 30;

        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.filter = "blur(3px)";
        const spiral = ctx.createRadialGradient(
          galX,
          galY,
          0,
          galX,
          galY,
          gal.r
        );
        spiral.addColorStop(0, "rgba(255,255,255,0.6)");
        spiral.addColorStop(0.3, "rgba(200,220,255,0.4)");
        spiral.addColorStop(1, "transparent");
        ctx.fillStyle = spiral;
        ctx.beginPath();
        ctx.arc(galX, galY, gal.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const startAngle = (i / 3) * Math.PI * 2 + t * 0.001;
          ctx.arc(galX, galY, gal.r * 0.7, startAngle, startAngle + 0.8);
          ctx.stroke();
        }
        ctx.filter = "none";
        ctx.restore();
      }

      // ── 3. Constellation lines (with parallax) ──
      ctx.save();
      ctx.strokeStyle = "rgba(200,220,255,0.18)";
      ctx.lineWidth = 0.6;
      ctx.setLineDash([3, 5]);
      for (const l of scene.conLines) {
        const parallax = 0.02;
        const x1 = l.x1p * w - mouseX * parallax * 20;
        const y1 = l.y1p * h - mouseY * parallax * 20;
        const x2 = l.x2p * w - mouseX * parallax * 20;
        const y2 = l.y2p * h - mouseY * parallax * 20;

        ctx.globalAlpha = 0.12 + Math.sin(t * 0.008 + l.x1p * 10) * 0.08;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // constellation dots with halos and parallax
      for (const d of scene.conDots) {
        const pulse = 0.55 + Math.sin(t * 0.01 + d.xp * 20) * 0.35;
        const dx = d.xp * w - mouseX * d.parallaxFactor * 40;
        const dy = d.yp * h - mouseY * d.parallaxFactor * 40;
        drawGlow(dx, dy, 6, "rgba(210,230,255,1)", pulse * 0.3);
        drawCircle(dx, dy, 1.8, "rgba(210,230,255,1)", pulse);
      }

      // ── 4. Stars with enhanced twinkle, cross-flares & parallax ──
      for (const s of scene.stars) {
        // Apply parallax
        s.x = s.baseX - mouseX * s.parallaxFactor * 100;
        s.y = s.baseY - mouseY * s.parallaxFactor * 100;

        s.alpha =
          s.baseAlpha +
          Math.sin(t * s.twinkleSpeed + s.twinklePhase) * (s.baseAlpha * 0.6);
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, s.alpha);
        ctx.fillStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (s.r > 1.4) {
          drawGlow(
            s.x,
            s.y,
            s.r * 5,
            `rgba(${s.color[0]},${s.color[1]},${s.color[2]},1)`,
            s.alpha * 0.25
          );
        }

        if (s.r > 1.8 && s.alpha > 0.6) {
          ctx.save();
          ctx.globalAlpha = s.alpha * 0.3;
          ctx.strokeStyle = `rgb(${s.color[0]},${s.color[1]},${s.color[2]})`;
          ctx.lineWidth = 0.5;
          const flareLen = s.r * 3;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── 5. Floating dust (enhanced with parallax) ──
      for (const d of scene.dust) {
        d.baseX += d.vx;
        d.baseY += d.vy;
        if (d.baseX < 0) d.baseX = w;
        if (d.baseX > w) d.baseX = 0;
        if (d.baseY < 0) d.baseY = h;
        if (d.baseY > h) d.baseY = 0;

        // Apply parallax
        d.x = d.baseX - mouseX * d.parallaxFactor * 80;
        d.y = d.baseY - mouseY * d.parallaxFactor * 80;

        const shimmer = Math.sin(t * 0.007 + d.baseX * 0.1) * 0.05;
        drawCircle(
          d.x,
          d.y,
          d.r,
          "rgba(180,210,255,1)",
          d.alpha + shimmer
        );
      }

      // ── 6. Orbit ellipses (slight parallax on center) ──
      const { cx: baseCx, cy: baseCy } = scene;
      const cx = baseCx - mouseX * 0.01 * 15;
      const cy = baseCy - mouseY * 0.01 * 15;

      for (const o of scene.orbits) {
        o.cx = cx;
        o.cy = cy;
        drawOrbitEllipse(cx, cy, o.rx, o.ry);
      }
      drawOrbitEllipse(cx, cy, 320, 90);

      // ── 7. Asteroid dots with slight rotation effect ──
      for (const [i, a] of scene.asteroids.entries()) {
        const wobble = Math.sin(t * 0.002 + i * 0.5) * 2;
        const ax = a.x - mouseX * 0.015 * 20;
        const ay = a.y - mouseY * 0.015 * 20;
        drawCircle(ax + wobble, ay, a.r, "rgba(148,163,184,1)", a.alpha);
      }

      // ── 8. Sun with solar flares ──
      sunPulse = Math.sin(t * 0.025) * 0.15 + 0.85;
      drawGlow(cx, cy, 140 * sunPulse, "rgba(251,191,36,1)", 0.05);
      drawGlow(cx, cy, 120 * sunPulse, "rgba(251,191,36,1)", 0.06);
      drawGlow(cx, cy, 60 * sunPulse, "rgba(251,191,36,1)", 0.12);
      drawGlow(cx, cy, 28 * sunPulse, "rgba(253,224,71,1)", 0.55);
      drawCircle(cx, cy, 11 * sunPulse, "#fef08a", 1);

      solarFlareTimer++;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.003;
        const len = 22 + Math.sin(t * 0.02 + i) * 10;
        const intensity = 0.18 + Math.sin(t * 0.018 + i * 0.5) * 0.1;
        ctx.save();
        ctx.globalAlpha = intensity;
        ctx.strokeStyle = "rgba(253,224,71,1)";
        ctx.lineWidth = i % 2 === 0 ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(a) * 13 * sunPulse,
          cy + Math.sin(a) * 13 * sunPulse
        );
        ctx.lineTo(
          cx + Math.cos(a) * (13 + len),
          cy + Math.sin(a) * (13 + len)
        );
        ctx.stroke();
        ctx.restore();
      }

      if (solarFlareTimer % 300 === 0 || (solarFlareTimer % 300 < 60 && solarFlareTimer % 300 > 50)) {
        const flareAngle = (solarFlareTimer * 0.01) % (Math.PI * 2);
        const flareAlpha = Math.max(
          0,
          1 - Math.abs((solarFlareTimer % 300) - 55) / 10
        );
        ctx.save();
        ctx.globalAlpha = flareAlpha * 0.4;
        ctx.strokeStyle = "rgba(255,220,100,1)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(flareAngle) * 15,
          cy + Math.sin(flareAngle) * 15
        );
        ctx.lineTo(
          cx + Math.cos(flareAngle) * 70,
          cy + Math.sin(flareAngle) * 70
        );
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 8; i++) {
        const sunDetailAngle = (i / 8) * Math.PI * 2 + t * 0.005;
        const detailR = 5 + Math.sin(t * 0.03 + i) * 2;
        drawCircle(
          cx + Math.cos(sunDetailAngle) * 8,
          cy + Math.sin(sunDetailAngle) * 8,
          detailR,
          "#fcd34d",
          0.5
        );
      }
      ctx.restore();

      // ── 9. Orbit planets with enhanced detail ──
      for (const o of scene.orbits) {
        o.angle += o.speed;
        const px = o.cx + Math.cos(o.angle) * o.rx;
        const py = o.cy + Math.sin(o.angle) * o.ry;

        if (o.atmosphereColor) {
          drawGlow(px, py, o.r * 3.5, o.atmosphereColor, 0.4);
        }

        if (o.hasRing) {
          ctx.save();
          ctx.globalAlpha = 0.35;
          ctx.strokeStyle = o.ringColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(
            px,
            py,
            o.r * 2.2,
            o.r * 0.55,
            o.angle + 0.4,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.ellipse(px, py, o.r * 0.9, o.r * 0.3, o.angle + 0.4, 0, Math.PI);
          ctx.fill();
          ctx.restore();
        }

        drawGlow(px, py, o.r * 5, o.color, 0.3);
        drawCircle(px, py, o.r, o.color, 1);

        if (o.craterCount && o.craterCount > 0) {
          ctx.save();
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          for (let i = 0; i < o.craterCount; i++) {
            const craterAngle = (i / o.craterCount) * Math.PI * 2 + o.angle;
            const craterDist = o.r * 0.5;
            const craterX = px + Math.cos(craterAngle) * craterDist;
            const craterY = py + Math.sin(craterAngle) * craterDist;
            ctx.beginPath();
            ctx.arc(craterX, craterY, o.r * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        drawCircle(
          px - o.r * 0.3,
          py - o.r * 0.3,
          o.r * 0.35,
          "rgba(255,255,255,1)",
          0.4
        );

        ctx.save();
        ctx.globalAlpha = 0.3;
        const grad = ctx.createRadialGradient(
          px - o.r * 0.3,
          py,
          o.r * 0.2,
          px + o.r * 0.5,
          py,
          o.r
        );
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, "rgba(0,0,0,0.6)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, o.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (o.hasMoon && o.moonR > 0) {
          o.moonAngle += o.moonSpeed;
          const md = o.r * 2.8;
          const mx2 = px + Math.cos(o.moonAngle) * md;
          const my2 = py + Math.sin(o.moonAngle) * md * 0.5;
          drawGlow(mx2, my2, o.moonR * 3, "rgba(203,213,225,0.5)", 0.3);
          drawCircle(mx2, my2, o.moonR, "rgba(203,213,225,1)", 0.85);
          ctx.save();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.beginPath();
          ctx.arc(mx2 + o.moonR * 0.3, my2, o.moonR * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // ── 10. Comets ──
      for (const c of scene.comets) {
        if (!c.active) {
          c.respawnTimer++;
          if (c.respawnTimer > 600) {
            c.active = true;
            c.respawnTimer = 0;
            c.x = Math.random() * w;
            c.y = -50;
            c.vx = (Math.random() - 0.5) * 2;
            c.vy = 1.5 + Math.random() * 2;
          }
        } else {
          c.x += c.vx;
          c.y += c.vy;
          if (c.y > h + 100) {
            c.active = false;
          }

          ctx.save();
          const tailGrad = ctx.createLinearGradient(
            c.x,
            c.y,
            c.x - c.vx * 20,
            c.y - c.vy * 20
          );
          tailGrad.addColorStop(0, "rgba(200,220,255,0.8)");
          tailGrad.addColorStop(0.5, "rgba(150,200,255,0.4)");
          tailGrad.addColorStop(1, "transparent");
          ctx.strokeStyle = tailGrad;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x - c.vx * c.tailLength, c.y - c.vy * c.tailLength);
          ctx.stroke();
          ctx.restore();

          drawGlow(c.x, c.y, 12, "rgba(200,240,255,1)", 0.7);
          drawCircle(c.x, c.y, 3, "rgba(230,245,255,1)", 1);
        }
      }

      // ── 11. Special objects (enhanced) ──
      const bhX = w * 0.82 - mouseX * 0.02 * 25;
      const bhY = h * 0.18 - mouseY * 0.02 * 25;
      drawGlow(bhX, bhY, 42, "rgba(251,191,36,1)", 0.2);

      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.3 - i * 0.08;
        ctx.strokeStyle = i % 2 === 0 ? "#fbbf24" : "#fb923c";
        ctx.lineWidth = 2 - i * 0.5;
        ctx.beginPath();
        ctx.ellipse(
          bhX,
          bhY,
          28 + i * 6,
          7 + i * 2,
          t * 0.012 + i * 0.5,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      drawCircle(bhX, bhY, 12, "#000", 1);
      drawCircle(bhX, bhY, 8, "#050505", 1);

      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "rgba(251,191,36,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bhX, bhY, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const pulsars = [
        { x: w * 0.88, y: h * 0.52, parallax: 0.025 },
        { x: w * 0.31, y: h * 0.87, parallax: 0.03 },
        { x: w * 0.63, y: h * 0.91, parallax: 0.028 },
      ];
      for (const [i, p] of pulsars.entries()) {
        const px = p.x - mouseX * p.parallax * 35;
        const py = p.y - mouseY * p.parallax * 35;
        const beat = (Math.sin(t * (0.14 + i * 0.05)) + 1) / 2;
        const beamAngle = t * 0.1 + i * 2;

        if (beat > 0.7) {
          ctx.save();
          ctx.globalAlpha = (beat - 0.7) * 2;
          ctx.strokeStyle = "rgba(199,210,254,0.6)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(
            px + Math.cos(beamAngle) * 100,
            py + Math.sin(beamAngle) * 100
          );
          ctx.stroke();
          ctx.restore();
        }

        drawCircle(px, py, 3, "rgb(199,210,254)", beat);
        drawGlow(px, py, 18 + beat * 22, "rgba(129,140,248,1)", beat * 0.4);

        const ring = (t * 0.08 + i * 2) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - ring) * 0.4;
        ctx.strokeStyle = "rgba(199,210,254,1)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, py, ring * 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const whX = w * 0.11 - mouseX * 0.035 * 40;
      const whY = h * 0.64 - mouseY * 0.035 * 40;
      for (const [i, r] of [36, 28, 20, 12, 6].entries()) {
        const spin = t * 0.008 * (i % 2 === 0 ? 1 : -1);
        ctx.save();
        ctx.globalAlpha = 0.35 - i * 0.05;
        ctx.strokeStyle =
          i % 2 === 0 ? "rgba(139,92,246,1)" : "rgba(56,189,248,1)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(whX, whY, r, spin, spin + Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < 8; i++) {
        const particleAngle = (i / 8) * Math.PI * 2 + t * 0.02;
        const particleDist = 40 + Math.sin(t * 0.05 + i) * 10;
        const particleAlpha = Math.sin(t * 0.05 + i) * 0.5 + 0.5;
        drawCircle(
          whX + Math.cos(particleAngle) * particleDist,
          whY + Math.sin(particleAngle) * particleDist,
          1.5,
          "rgba(167,139,250,1)",
          particleAlpha
        );
      }

      drawGlow(
        whX,
        whY,
        18,
        "rgba(167,139,250,1)",
        0.5 + Math.sin(t * 0.02) * 0.2
      );
      drawCircle(whX, whY, 4, "rgba(196,181,253,1)", 0.95);

      const binaryPairs = [
        { x: w * 0.24, y: h * 0.19, parallax: 0.018 },
        { x: w * 0.67, y: h * 0.79, parallax: 0.022 },
        { x: w * 0.45, y: h * 0.06, parallax: 0.02 },
      ];
      for (const [idx, b] of binaryPairs.entries()) {
        const bx = b.x - mouseX * b.parallax * 30;
        const by = b.y - mouseY * b.parallax * 30;
        const ba = t * 0.008 + idx;
        const d = 14;

        const wavePhase = (t * 0.05 + idx) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - wavePhase) * 0.2;
        ctx.strokeStyle = "rgba(251,191,36,0.5)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(bx, by, wavePhase * 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        drawGlow(
          bx + Math.cos(ba) * d,
          by + Math.sin(ba) * d * 0.5,
          12,
          "rgba(251,191,36,1)",
          0.4
        );
        drawCircle(
          bx + Math.cos(ba) * d,
          by + Math.sin(ba) * d * 0.5,
          3.5,
          "#fde047",
          1
        );

        drawGlow(
          bx - Math.cos(ba) * d,
          by - Math.sin(ba) * d * 0.5,
          10,
          "rgba(139,92,246,1)",
          0.4
        );
        drawCircle(
          bx - Math.cos(ba) * d,
          by - Math.sin(ba) * d * 0.5,
          2.8,
          "#c4b5fd",
          1
        );
      }

      const ssX = (w * 0.6 + Math.sin(t * 0.006) * 18) - mouseX * 0.03 * 45;
      const ssY = (h * 0.28 + Math.cos(t * 0.004) * 10) - mouseY * 0.03 * 45;
      ctx.save();
      ctx.translate(ssX, ssY);
      ctx.rotate(Math.sin(t * 0.005) * 0.12);
      ctx.globalAlpha = 0.85;

      ctx.fillStyle = "rgba(96,165,250,0.7)";
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-20 + i * 3, -3, 2.5, 1.5);
        ctx.fillRect(-20 + i * 3, 2, 2.5, 1.5);
        ctx.fillRect(10 + i * 3, -3, 2.5, 1.5);
        ctx.fillRect(10 + i * 3, 2, 2.5, 1.5);
      }

      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(-5, -2, 10, 4);
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-5, 0);
      ctx.moveTo(5, 0);
      ctx.lineTo(18, 0);
      ctx.stroke();

      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -10);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(0, -10, 2.5, 0, Math.PI, true);
      ctx.fill();

      const blink1 = Math.sin(t * 0.06) > 0 ? 0.9 : 0.1;
      const blink2 = Math.sin(t * 0.08 + 1) > 0 ? 0.9 : 0.1;
      drawCircle(-4, 0, 1, "rgba(248,113,113,1)", blink1);
      drawCircle(4, 0, 1, "rgba(34,211,238,1)", blink2);
      drawCircle(0, -7, 1.2, "rgba(74,222,128,1)", (blink1 + blink2) / 2);
      ctx.restore();

      const sats = [
        { xp: 0.35, yp: 0.42, speed: 0.0003, phase: 0, parallax: 0.04 },
        { xp: 0.72, yp: 0.3, speed: 0.0002, phase: 1, parallax: 0.038 },
        { xp: 0.15, yp: 0.6, speed: 0.00025, phase: 2.5, parallax: 0.042 },
      ];
      for (const s of sats) {
        const sx = ((s.xp + Math.cos(t * s.speed + s.phase) * 0.18) * w) - mouseX * s.parallax * 55;
        const sy = ((s.yp + Math.sin(t * s.speed * 0.7 + s.phase) * 0.08) * h) - mouseY * s.parallax * 55;

        if (Math.sin(t * 0.03 + s.phase) > 0.5) {
          ctx.save();
          ctx.globalAlpha = 0.15;
          ctx.strokeStyle = "rgba(56,189,248,1)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ssX, ssY);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(t * 0.015 + s.phase);
        ctx.globalAlpha = 0.75;

        ctx.fillStyle = "#64748b";
        ctx.fillRect(-3.5, -1.5, 7, 3);

        ctx.fillStyle = "rgba(96,165,250,0.85)";
        ctx.fillRect(-9, -1, 4.5, 2);
        ctx.fillRect(4.5, -1, 4.5, 2);

        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -1.5);
        ctx.lineTo(0, -5);
        ctx.stroke();

        const satBlink = Math.sin(t * 0.1 + s.phase) > 0 ? 1 : 0.2;
        drawCircle(0, 0, 0.8, "rgba(34,211,238,1)", satBlink);
        ctx.restore();
      }

      // ── 12. Shooting streaks (enhanced with parallax) ──
      for (const s of scene.streaks) {
        if (!s.active) {
          s.cooldown++;
          if (s.cooldown >= s.maxCooldown) {
            s.active = true;
            s.cooldown = 0;
            s.timer = 0;
            s.baseX = Math.random() * w * 0.85;
            s.baseY = Math.random() * h * 0.55;
            s.alpha = 1;
          }
        } else {
          s.timer += s.speed;
          s.alpha = Math.max(0, 1 - s.timer / s.len);

          // Apply parallax
          s.x = s.baseX - mouseX * s.parallaxFactor * 60;
          s.y = s.baseY - mouseY * s.parallaxFactor * 60;

          const ex = s.x + Math.cos(s.angle) * s.timer;
          const ey = s.y + Math.sin(s.angle) * s.timer;

          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.3, s.color + (s.alpha * 0.4) + ")");
          grad.addColorStop(0.7, s.color + (s.alpha * 0.9) + ")");
          grad.addColorStop(1, "rgba(255,255,255," + s.alpha + ")");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.restore();

          drawGlow(ex, ey, 8, "rgba(255,255,255,1)", s.alpha * 0.6);

          if (s.alpha <= 0) {
            s.active = false;
            s.maxCooldown = 200 + Math.random() * 400;
          }
        }
      }

      // ── 13. Aurora-like light waves ──
      if (w > 800) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        const auroraY = h * 0.7;
        for (let i = 0; i < 3; i++) {
          const waveOffset = Math.sin(t * 0.005 + i * 2) * 40;
          const grad = ctx.createLinearGradient(
            0,
            auroraY + waveOffset - 60,
            0,
            auroraY + waveOffset + 60
          );
          const colors = [
            "rgba(34,211,238,0)",
            "rgba(139,92,246,0.4)",
            "rgba(34,211,238,0)",
          ];
          grad.addColorStop(0, colors[0]);
          grad.addColorStop(0.5, colors[1]);
          grad.addColorStop(1, colors[2]);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, auroraY + waveOffset - 60);
          for (let x = 0; x <= w; x += 20) {
            const wave =
              Math.sin(x * 0.01 + t * 0.01 + i) * 30 + auroraY + waveOffset;
            ctx.lineTo(x, wave);
          }
          ctx.lineTo(w, auroraY + waveOffset + 60);
          ctx.lineTo(0, auroraY + waveOffset + 60);
          ctx.fill();
        }
        ctx.restore();
      }

      // ── 14. Vignette ──
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.95);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(0.7, "rgba(0,2,10,0.3)");
      vig.addColorStop(1, "rgba(0,2,10,0.85)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}