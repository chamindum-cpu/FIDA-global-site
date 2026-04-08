"use client";

import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.email, // using email field as username for the SQL query
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirection on success
        window.location.href = "/admin";
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the authentication server.");
      console.error("Login catch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] relative overflow-hidden p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--green-glow)] rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--blue-glow)] rounded-full blur-[120px] opacity-30" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="glass rounded-[40px] p-10 border border-[var(--grey-dark)] shadow-2xl relative">
          {/* Logo / Icon */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--green)] to-[var(--blue)] flex items-center justify-center shadow-2xl shadow-[var(--green-glow)]">
              <ShieldCheck size={40} className="text-white" />
            </div>
          </div>

          <div className="mt-10 mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
            <p className="text-[var(--text-secondary)] mt-2">Enter your credentials to manage FIDA Global.</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest ml-1">Username / Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--green)] transition-smooth" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="admin_id"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm placeholder:opacity-50"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Password</label>
                <button type="button" className="text-[var(--green)] text-xs font-bold hover:underline transition-smooth">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--green)] transition-smooth" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-smooth"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold text-sm shadow-xl shadow-[var(--green-glow)] hover:scale-[1.02] active:scale-[0.98] transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--grey-dark)] text-center">
            <Link href="/" className="text-[var(--text-muted)] text-xs hover:text-[var(--text-primary)] transition-smooth flex items-center justify-center gap-2">
              <ArrowRight size={14} className="rotate-180" />
              Return to Website
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em]">
          Powered by FIDA Intelligence • v1.0.4
        </p>
      </motion.div>
    </div>
  );
}
