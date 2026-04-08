"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Award, Zap, Shield, Database, Cloud, Code, AlertCircle, Cpu, Terminal, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const icons = [
  { name: "Server", component: Cloud },
  { name: "Shield", component: Shield },
  { name: "Zap", component: Zap },
  { name: "Database", component: Database },
  { name: "Cloud", component: Cloud },
  { name: "Code", component: Code },
  { name: "Cpu", component: Cpu },
  { name: "Terminal", component: Terminal },
  { name: "Users", component: Users },
];

export default function CreateExpertise() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Server",
    orderIndex: "0",
    status: "Published",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Please fill in the title and description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/expertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderIndex: parseInt(formData.orderIndex),
        }),
      });

      if (response.ok) {
        router.push("/admin/expertise");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to add expertise.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/expertise" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Add Expertise Module</h2>
            <p className="text-[var(--text-secondary)] mt-1">Define a core capability to display on your homepage.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Adding..." : "Add Module"}
        </button>
      </header>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Expertise Title</label>
              <input 
                type="text" 
                placeholder="Ex: Cybersecurity Solutions..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-lg font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Short Description</label>
              <textarea 
                rows={4}
                placeholder="Summarize this capability in one or two sentences..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-4">
               <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Select Appearance Icon</label>
               <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {icons.map((item) => {
                    const Icon = item.component;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({...formData, icon: item.name})}
                        className={`p-6 rounded-2xl flex flex-col items-center gap-2 border transition-smooth ${formData.icon === item.name ? 'bg-[var(--green-glow)] border-[var(--green)] text-[var(--green)]' : 'bg-[var(--bg-elevated)] border-[var(--grey-dark)] text-[var(--text-muted)] hover:border-[var(--text-secondary)]'}`}
                      >
                         <Icon size={24} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                      </button>
                    )
                  })}
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Award size={18} className="text-[var(--green)]" />
               Configuration
             </h3>

             <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Display Order</label>
                <input 
                  type="number" 
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({...formData, orderIndex: e.target.value})}
                />
             </div>

             <div className="space-y-3 pt-4">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Visibility Status</label>
                <div className="grid grid-cols-2 gap-2">
                    {["Draft", "Published"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s})}
                        className={`py-3 rounded-xl text-xs font-bold transition-smooth ${formData.status === s ? 'bg-[var(--green-glow)] text-[var(--green)] border border-[var(--green)]/30' : 'bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--grey-dark)] text-[var(--text-secondary)]'}`}
                      >
                        {s}
                      </button>
                    ))}
                </div>
             </div>
          </div>

          <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs leading-relaxed">
             <p>This module will appear in the "Our Expertise" grid on the main page. Use unique icons and concise descriptions for the best visual impact.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
