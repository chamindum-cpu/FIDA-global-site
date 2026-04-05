"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  isLoading: boolean;
}

/* ── Easing ──────────────────────────────────────────── */
const EXPO = [0.86, 0, 0.07, 1] as const;
const SMOOTH = [0.16, 1, 0.3, 1] as const;

export default function PageLoader({ isLoading }: PageLoaderProps) {
  const [count, setCount] = useState(0);

  /* Animate counter 0 → 100 while loading is active */
  useEffect(() => {
    if (!isLoading) { setCount(0); return; }

    setCount(0);
    const duration = 900; // ms
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease-out curve so progress feels fast then smooth
      const progress = 1 - Math.pow(1 - step / steps, 2);
      setCount(Math.round(progress * 100));
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] pointer-events-all overflow-hidden"
        >
          {/* ── Panel 1 — slides from top ────────────────── */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: EXPO }}
            className="absolute inset-0 bg-[#141e30]"
            style={{ zIndex: 2 }}
          />

          {/* ── Panel 2 — slightly delayed, darker accent ── */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: EXPO, delay: 0.06 }}
            className="absolute inset-0"
            style={{
              zIndex: 1,
              background:
                "linear-gradient(160deg, #76c442 0%, #38a3f5 40%, #141e30 80%)",
              opacity: 0.15,
            }}
          />

          {/* ── Content layer ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: SMOOTH }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 10 }}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.55, ease: SMOOTH, delay: 0.25 }}
            >
              <img
                src="/Fidalong.png"
                alt="FIDA Global"
                className="h-16 md:h-24 w-auto object-contain"
                style={{ filter: "brightness(1.1)" }}
              />
            </motion.div>

            {/* Thin divider line that draws in */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.6, ease: SMOOTH, delay: 0.35 }}
              style={{ originX: 0 }}
              className="mt-8 w-40 h-[1px] bg-gradient-to-r from-[#76c442] via-[#38a3f5] to-transparent"
            />

            {/* Loading label + counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: SMOOTH, delay: 0.45 }}
              className="mt-6 flex items-center gap-4"
            >
              <span
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "#94a3b8" }}
              >
                Loading
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{
                  background: "linear-gradient(90deg, #76c442, #38a3f5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {count}%
              </span>
            </motion.div>

            {/* Progress bar track */}
            <div
              className="mt-4 w-48 h-[2px] rounded-full overflow-hidden"
              style={{ background: "rgba(139,160,184,0.12)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #76c442, #38a3f5)",
                  width: `${count}%`,
                  transition: "width 0.08s linear",
                }}
              />
            </div>

            {/* Rotating dots indicator */}
            <motion.div
              className="mt-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i === 0 ? "#76c442" : i === 1 ? "#38a3f5" : "#8ba0b8",
                  }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* ── Decorative corner marks ───────────────────── */}
          {[
            { top: "20px", left: "20px", borderTop: true, borderLeft: true },
            { top: "20px", right: "20px", borderTop: true, borderRight: true },
            { bottom: "20px", left: "20px", borderBottom: true, borderLeft: true },
            { bottom: "20px", right: "20px", borderBottom: true, borderRight: true },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              style={{
                position: "absolute",
                zIndex: 15,
                width: 20,
                height: 20,
                ...pos,
                borderTop: (pos as Record<string, unknown>).borderTop
                  ? "1px solid rgba(118,196,66,0.4)"
                  : undefined,
                borderLeft: (pos as Record<string, unknown>).borderLeft
                  ? "1px solid rgba(118,196,66,0.4)"
                  : undefined,
                borderBottom: (pos as Record<string, unknown>).borderBottom
                  ? "1px solid rgba(56,163,245,0.4)"
                  : undefined,
                borderRight: (pos as Record<string, unknown>).borderRight
                  ? "1px solid rgba(56,163,245,0.4)"
                  : undefined,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
