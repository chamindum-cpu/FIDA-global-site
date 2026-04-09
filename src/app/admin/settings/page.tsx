"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Sparkles, Trees, Snowflake, Sun, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSeason = async (season: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        body: JSON.stringify({ key: "active_season", value: season }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setSettings({ ...settings, active_season: season });
        alert("Seasonal decoration updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating season");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading Global Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-white">Global Settings</h2>
        <p className="text-[var(--text-secondary)] mt-1">Configure site-wide preferences and seasonal themes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seasonal Decoration Card */}
        <section className="glass rounded-[2.5rem] p-10 border border-white/10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Seasonal Decorations</h3>
              <p className="text-sm text-[var(--text-secondary)]">Choose an active theme for the home page hero section.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SeasonButton 
              active={settings.active_season === "None"} 
              onClick={() => updateSeason("None")} 
              icon={<XIcon />} 
              label="Standard (None)" 
              desc="Normal business theme"
            />
            <SeasonButton 
              active={settings.active_season === "NewYear"} 
              onClick={() => updateSeason("NewYear")} 
              icon={<Sun className="text-yellow-400" />} 
              label="Sri Lankan New Year" 
              desc="Fireworks & Celebration"
            />
            <SeasonButton 
              active={settings.active_season === "Christmas"} 
              onClick={() => updateSeason("Christmas")} 
              icon={<Snowflake className="text-blue-400" />} 
              label="Christmas" 
              desc="Falling Snow & Festive"
            />
            <SeasonButton 
              active={settings.active_season === "Vesak"} 
              onClick={() => updateSeason("Vesak")} 
              icon={<Trees className="text-orange-400" />} 
              label="Vesak Festival" 
              desc="Floating Lanterns & Glow"
            />
          </div>
        </section>

        {/* Placeholder for other settings */}
        <section className="glass rounded-[2.5rem] p-10 border border-white/10 opacity-50 pointer-events-none">
           <h3 className="text-xl font-bold text-white mb-4">Other Preferences</h3>
           <p className="text-sm text-[var(--text-secondary)]">Coming soon: Maintenance Mode, Newsletter Config, etc.</p>
        </section>
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

function SeasonButton({ active, onClick, icon, label, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-3xl border text-left transition-all ${
        active 
          ? "bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10" 
          : "bg-white/5 border-white/5 hover:border-white/20"
      }`}
    >
      <div className="mb-4">{icon}</div>
      <div className={`font-bold text-sm mb-1 ${active ? "text-blue-400" : "text-white"}`}>{label}</div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">{desc}</div>
    </button>
  );
}
