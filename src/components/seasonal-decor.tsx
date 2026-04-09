"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type Season = "None" | "NewYear" | "Christmas" | "Vesak";

export default function SeasonalDecor() {
  const [season, setSeason] = useState<Season>("None");

  useEffect(() => {
    async function fetchSeason() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        console.log("Active Season Data:", data);
        if (data.active_season) {
          setSeason(data.active_season as Season);
        }
      } catch (err) {
        console.error("Failed to fetch season:", err);
      }
    }
    fetchSeason();
  }, []);

  if (season === "None") return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[50]">
      {season === "NewYear" && <NewYearDecor />}
      {season === "Christmas" && <ChristmasDecor />}
      {season === "Vesak" && <VesakDecor />}
    </div>
  );
}

function NewYearDecor() {
  return (
    <>
      {/* Subtle Fireworks / Sparkles */}
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1, 0], 
            opacity: [0, 1, 1, 0],
            x: [0, (Math.random() - 0.5) * 800],
            y: [0, (Math.random() - 0.5) * 800]
          }}
          transition={{ 
            duration: 3 + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_10px_#fbbf24]"
        />
      ))}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-10 filter invert pointer-events-none">
         {/* Traditional Pattern placeholder */}
         <div className="w-full h-full border-4 border-dashed border-white rounded-full animate-spin-slow" />
      </div>
    </>
  );
}

function ChristmasDecor() {
  return (
    <>
      {/* Falling Snow */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * 100 + "%" }}
          animate={{ 
            y: "110vh",
            x: (Math.random() * 100) + (Math.random() * 20 - 10) + "%"
          }}
          transition={{ 
            duration: 15 + Math.random() * 15, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 15
          }}
          className="absolute w-2 h-2 bg-white rounded-full blur-[1px] opacity-60 shadow-[0_0_8px_white]"
        />
      ))}
    </>
  );
}

function VesakDecor() {
  return (
    <>
      {/* Floating Lanterns (Lotus Shape Inspired) */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: (5 + Math.random() * 90) + "%", opacity: 0, scale: 0.8 }}
          animate={{ 
            y: "-20vh",
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.8, 1.2, 1.2, 0.8],
            x: [(5 + Math.random() * 90) + "%", (Math.random() * 100) + "%"]
          }}
          transition={{ 
            duration: 20 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: Math.random() * 20
          }}
          className="absolute flex items-center justify-center"
        >
           {/* Lantern / Lotus hybrid glow */}
           <div className="w-12 h-12 rounded-full bg-orange-500/40 blur-xl animate-pulse" />
           <div className="absolute w-6 h-6 rotate-45 border-2 border-orange-400/50 shadow-[0_0_15px_#fb923c]" />
           <div className="absolute w-4 h-4 rounded-full bg-orange-300 blur-[2px]" />
        </motion.div>
      ))}
    </>
  );
}
