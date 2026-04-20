"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface PageLoaderProps {
  isLoading: boolean;
}

const SMOOTH = [0.16, 1, 0.3, 1] as const;

const BOOT_LINES = [
  { text: "INITIALIZING SECURE CHANNEL",  status: "OK"    },
  { text: "VALIDATING CERTIFICATES",       status: "OK"    },
  { text: "LOADING ASSET REGISTRY",        status: "OK"    },
  { text: "SYNCHRONIZING DATA NODES",      status: "OK"    },
  { text: "ESTABLISHING UPLINK",           status: "OK"    },
  { text: "ALL SYSTEMS NOMINAL",           status: "READY" },
];

function randHex(len: number) {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join(" ");
}

// ── HUD Corner Bracket ────────────────────────────────────────────────────────
function HUDCorner({ position, delay }: { position: string; delay: number }) {
  const isTop  = position.includes("top");
  const isLeft = position.includes("left");
  const SIZE = 32;
  const GREEN = "rgba(118,196,66,0.7)";
  const BLUE  = "rgba(56,163,245,0.7)";
  const DOT   = isLeft ? "#76c442" : "#38a3f5";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ delay, duration: 0.5, ease: SMOOTH }}
      style={{
        position: "absolute",
        zIndex: 25,
        ...(isTop    ? { top: 18 }    : { bottom: 18 }),
        ...(isLeft   ? { left: 18 }   : { right: 18 }),
        width: SIZE,
        height: SIZE,
      }}
    >
      {/* Outer tick marks */}
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 0,
        [isLeft ? "left" : "right"]: SIZE + 4,
        width: 8, height: 1,
        background: isTop ? GREEN : BLUE,
        opacity: 0.4,
      }} />
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: SIZE + 4,
        [isLeft ? "left" : "right"]: 0,
        width: 1, height: 8,
        background: isLeft ? GREEN : BLUE,
        opacity: 0.4,
      }} />
      {/* Main horizontal arm */}
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 0,
        [isLeft ? "left" : "right"]: 0,
        width: SIZE, height: 1,
        background: `linear-gradient(${isLeft ? "90deg" : "-90deg"}, ${isTop ? GREEN : BLUE}, transparent)`,
      }} />
      {/* Main vertical arm */}
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: 0,
        [isLeft ? "left" : "right"]: 0,
        width: 1, height: SIZE,
        background: `linear-gradient(${isTop ? "180deg" : "0deg"}, ${isLeft ? GREEN : BLUE}, transparent)`,
      }} />
      {/* Glow dot */}
      <div style={{
        position: "absolute",
        [isTop ? "top" : "bottom"]: -1.5,
        [isLeft ? "left" : "right"]: -1.5,
        width: 4, height: 4,
        borderRadius: "50%",
        background: DOT,
        boxShadow: `0 0 8px 2px ${DOT}`,
      }} />
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [count, setCount]           = useState(0);
  const [bootLine, setBootLine]     = useState(0);
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [glitch, setGlitch]         = useState(false);
  const glitchShiftRef              = useRef(0);

  /* Counter 0 → 100 */
  useEffect(() => {
    if (!isLoading) { setCount(0); setBootLine(0); return; }
    setCount(0); setBootLine(0);
    const steps = 80, duration = 2400, interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / steps, 2.5);
      setCount(Math.round(p * 100));
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [isLoading]);

  /* Boot line progression */
  useEffect(() => {
    if (!isLoading) return;
    let line = 0;
    const gap = 2400 / BOOT_LINES.length;
    const t = setInterval(() => {
      line++;
      setBootLine(line);
      if (line >= BOOT_LINES.length) clearInterval(t);
    }, gap);
    return () => clearInterval(t);
  }, [isLoading]);

  /* Data stream refresh */
  useEffect(() => {
    if (!isLoading) return;
    const update = () => setDataStream(Array.from({ length: 14 }, () => randHex(8)));
    update();
    const t = setInterval(update, 110);
    return () => clearInterval(t);
  }, [isLoading]);

  /* Occasional glitch */
  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(() => {
      if (Math.random() > 0.68) {
        glitchShiftRef.current = (Math.random() - 0.5) * 5;
        setGlitch(true);
        setTimeout(() => setGlitch(false), 60 + Math.random() * 80);
      }
    }, 700);
    return () => clearInterval(t);
  }, [isLoading]);

  /* SVG ring params */
  const RING_R = 92;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C - (count / 100) * RING_C;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
        >
          {/* ── CSS ──────────────────────────────────────────────────────────── */}
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');

            @keyframes hexPulse {
              0%,100% { opacity:.03 } 50% { opacity:.065 }
            }
            @keyframes dataDrift {
              0%   { transform: translateY(0) }
              100% { transform: translateY(-50%) }
            }
            @keyframes blinkDot {
              0%,100% { opacity:1 } 50% { opacity:0 }
            }
            @keyframes radarSpin {
              0%   { transform: rotate(0deg) }
              100% { transform: rotate(360deg) }
            }
            @keyframes gridShift {
              0%,100% { background-position: 0 0 }
              50%      { background-position: 4px 4px }
            }
          ` }} />

          {/* ── Dark base ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
            style={{ background: "#030912" }}
          />

          {/* ── Hex grid overlay ───────────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ animation: "hexPulse 5s ease-in-out infinite" }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexgrid" x="0" y="0" width="56" height="49"
                  patternUnits="userSpaceOnUse">
                  <polygon
                    points="28,2 54,15 54,34 28,47 2,34 2,15"
                    fill="none" stroke="#38a3f5" strokeWidth="0.4"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexgrid)" />
            </svg>
          </div>

          {/* ── Scan beam (single pass) ────────────────────────────────────── */}
          <motion.div
            initial={{ top: "-3px", opacity: 0.9 }}
            animate={{ top: "105%", opacity: 0 }}
            transition={{ duration: 2.2, ease: "linear", delay: 0.2 }}
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              zIndex: 8,
              height: "3px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(56,163,245,0.9) 30%, rgba(118,196,66,1) 60%, rgba(56,163,245,0.9) 80%, transparent 100%)",
              boxShadow:
                "0 0 12px 3px rgba(56,163,245,0.5), 0 0 32px 8px rgba(118,196,66,0.15)",
            }}
          />

          {/* ── Left data stream ───────────────────────────────────────────── */}
          <div className="absolute left-0 top-0 bottom-0 w-24 overflow-hidden"
            style={{ zIndex: 6 }}>
            <div style={{ animation: "dataDrift 3.5s linear infinite" }}>
              {[...dataStream, ...dataStream].map((row, i) => (
                <div key={i} style={{
                  color: "rgba(118,196,66,0.3)",
                  fontSize: "9px", lineHeight: "1.9",
                  letterSpacing: "0.08em", padding: "0 10px",
                }}>
                  {row}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right data stream ──────────────────────────────────────────── */}
          <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden"
            style={{ zIndex: 6 }}>
            <div style={{ animation: "dataDrift 2.8s linear infinite reverse" }}>
              {[...dataStream, ...dataStream].map((row, i) => (
                <div key={i} style={{
                  color: "rgba(56,163,245,0.3)",
                  fontSize: "9px", lineHeight: "1.9",
                  letterSpacing: "0.08em", padding: "0 10px", textAlign: "right",
                }}>
                  {row}
                </div>
              ))}
            </div>
          </div>

          {/* Fade masks over streams */}
          <div className="absolute inset-y-0 left-0 w-28 pointer-events-none"
            style={{ zIndex: 7, background: "linear-gradient(90deg, #030912 55%, transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-28 pointer-events-none"
            style={{ zIndex: 7, background: "linear-gradient(-90deg, #030912 55%, transparent)" }} />

          {/* ── Top label bar ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 0.45, duration: 0.45, ease: SMOOTH }}
            style={{
              position: "absolute", top: 20, left: "50%",
              transform: "translateX(-50%)", zIndex: 30,
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <div style={{
              width: 5, height: 5, background: "#76c442",
              animation: "blinkDot 1s step-end infinite",
            }} />
            <span style={{
              fontSize: "8px", letterSpacing: "0.38em",
              color: "rgba(118,196,66,0.75)", fontFamily: "inherit",
              textTransform: "uppercase",
            }}>
              SYSTEM INITIALIZING
            </span>
            <div style={{
              width: 5, height: 5, background: "#38a3f5",
              animation: "blinkDot 1s step-end infinite 0.5s",
            }} />
          </motion.div>

          {/* ── Central content ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 20 }}
          >
            {/* Ring + Logo cluster */}
            <div style={{ position: "relative", width: 224, height: 224,
              display: "flex", alignItems: "center", justifyContent: "center" }}>

              {/* SVG rings */}
              <svg width="224" height="224"
                style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                  <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#76c442" />
                    <stop offset="100%" stopColor="#38a3f5" />
                  </linearGradient>
                  <filter id="arcGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Dashed tick ring */}
                <circle cx="112" cy="112" r={RING_R}
                  fill="none" stroke="rgba(56,163,245,0.07)"
                  strokeWidth="10" strokeDasharray="3 9"
                  transform="rotate(-90 112 112)" />

                {/* Faint track */}
                <circle cx="112" cy="112" r={RING_R}
                  fill="none" stroke="rgba(56,163,245,0.1)" strokeWidth="1" />

                {/* Glow arc */}
                <circle cx="112" cy="112" r={RING_R}
                  fill="none"
                  stroke="rgba(118,196,66,0.25)"
                  strokeWidth="8"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 112 112)"
                  style={{ filter: "blur(5px)", transition: "stroke-dashoffset 0.09s linear" }}
                />

                {/* Main progress arc */}
                <circle cx="112" cy="112" r={RING_R}
                  fill="none"
                  stroke="url(#arcGrad)"
                  strokeWidth="1.8"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 112 112)"
                  style={{ transition: "stroke-dashoffset 0.09s linear" }}
                />

                {/* Tick marks every 30° */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const ang = (i / 12) * Math.PI * 2 - Math.PI / 2;
                  const inner = RING_R - 6, outer = RING_R + 6;
                  return (
                    <line key={i}
                      x1={112 + Math.cos(ang) * inner}
                      y1={112 + Math.sin(ang) * inner}
                      x2={112 + Math.cos(ang) * outer}
                      y2={112 + Math.sin(ang) * outer}
                      stroke={i % 3 === 0 ? "rgba(118,196,66,0.45)" : "rgba(56,163,245,0.2)"}
                      strokeWidth={i % 3 === 0 ? 1 : 0.5}
                    />
                  );
                })}
              </svg>

              {/* Spinning inner rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", width: 158, height: 158,
                  borderRadius: "50%",
                  border: "1px solid transparent",
                  borderTop: "1px solid rgba(56,163,245,0.45)",
                  borderRight: "1px solid rgba(56,163,245,0.12)",
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", width: 130, height: 130,
                  borderRadius: "50%",
                  border: "1px solid transparent",
                  borderBottom: "1px solid rgba(118,196,66,0.45)",
                  borderLeft: "1px solid rgba(118,196,66,0.12)",
                }}
              />

              {/* Radar sweep */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", width: 120, height: 120,
                  borderRadius: "50%", overflow: "hidden",
                  opacity: 0.35,
                }}
              >
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: "50%", height: "50%",
                  transformOrigin: "0% 100%",
                  background:
                    "conic-gradient(from 0deg, rgba(118,196,66,0.5), transparent 60deg)",
                }} />
              </motion.div>

              {/* Logo */}
              <div style={{ position: "relative", zIndex: 5 }}>
                <motion.img
                  src="/Fidalong.png"
                  alt="FIDA Global"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: SMOOTH }}
                  style={{
                    height: 52, width: "auto", objectFit: "contain",
                    filter: glitch
                      ? "brightness(1.4) drop-shadow(3px 0 rgba(118,196,66,0.9)) drop-shadow(-3px 0 rgba(56,163,245,0.9))"
                      : "brightness(1.1) drop-shadow(0 0 8px rgba(56,163,245,0.25))",
                    transform: glitch
                      ? `translateX(${glitchShiftRef.current}px)`
                      : "translateX(0)",
                    transition: "filter 0.04s, transform 0.04s",
                  }}
                />
              </div>

              {/* Percentage badge */}
              <div style={{
                position: "absolute", bottom: -6, left: "50%",
                transform: "translateX(-50%)",
                background: "#030912",
                border: "1px solid rgba(56,163,245,0.22)",
                padding: "2px 12px",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em",
                  background: "linear-gradient(90deg, #76c442, #38a3f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  {String(count).padStart(3, "0")} %
                </span>
              </div>
            </div>

            {/* ── Boot log ──────────────────────────────────────────────── */}
            <div style={{ marginTop: 52, width: 340, maxWidth: "80vw" }}>
              {/* Log header */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                marginBottom: 8,
                borderBottom: "1px solid rgba(56,163,245,0.12)",
                paddingBottom: 4,
              }}>
                <span style={{ fontSize: "8px", letterSpacing: "0.3em", color: "rgba(56,163,245,0.45)" }}>
                  SUBSYSTEM
                </span>
                <span style={{ fontSize: "8px", letterSpacing: "0.3em", color: "rgba(56,163,245,0.45)" }}>
                  STATUS
                </span>
              </div>

              {BOOT_LINES.map((line, i) => {
                const active = bootLine > i;
                const isCurrent = bootLine === i + 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: active ? 1 : 0.18, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center",
                      padding: "4px 0",
                      borderBottom: "1px solid rgba(56,163,245,0.055)",
                      background: isCurrent
                        ? "linear-gradient(90deg, rgba(118,196,66,0.04), transparent)"
                        : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        fontSize: "9px",
                        color: active ? "#76c442" : "rgba(148,163,184,0.3)",
                        opacity: active ? 1 : 0,
                      }}>▸</span>
                      <span style={{
                        fontSize: "9px", letterSpacing: "0.13em",
                        color: active ? "rgba(200,220,240,0.85)" : "rgba(148,163,184,0.22)",
                      }}>
                        {line.text}
                      </span>
                    </div>
                    <span style={{
                      fontSize: "8px", letterSpacing: "0.2em", fontWeight: 700,
                      color: active
                        ? (line.status === "READY" ? "#76c442" : "rgba(56,163,245,0.85)")
                        : "rgba(148,163,184,0.18)",
                    }}>
                      {active ? line.status : "···"}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Progress bar ──────────────────────────────────────────── */}
            <div style={{
              marginTop: 20, width: 340, maxWidth: "80vw",
              height: 2, background: "rgba(56,163,245,0.08)",
              borderRadius: 2, overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #76c442, #38a3f5)",
                width: `${count}%`,
                transition: "width 0.09s linear",
                borderRadius: 2,
              }} />
              {/* Shimmer on bar */}
              <motion.div
                animate={{ x: ["−100%", "400%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "20%", height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* ── HUD corners ───────────────────────────────────────────────── */}
          <HUDCorner position="top-left"     delay={0.2}  />
          <HUDCorner position="top-right"    delay={0.26} />
          <HUDCorner position="bottom-left"  delay={0.32} />
          <HUDCorner position="bottom-right" delay={0.38} />

          {/* ── Bottom coordinate strip ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            style={{
              position: "absolute", bottom: 22, left: "50%",
              transform: "translateX(-50%)", zIndex: 30,
              display: "flex", gap: 28,
            }}
          >
            {["LAT 6.9271° N", "LNG 79.8612° E", "ALT 0043 M"].map((s, i) => (
              <span key={i} style={{
                fontSize: "8px", letterSpacing: "0.2em",
                color: "rgba(148,163,184,0.35)",
              }}>{s}</span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}