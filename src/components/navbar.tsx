"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, ArrowRight } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Company Profile", href: "https://www.fidaglobal.com/FIDAGlobalProfile2024.pdf", isExternal: true },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Solutions", href: "/solutions" },
  { name: "Blog", href: "/blog" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <>
      {/* ── Main Top Bar (Absolute) ────────────────── */}
      <nav className="absolute top-0 left-0 right-0 z-40 py-8">
        <div className="container mx-auto px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/Fidalong.png"
              alt="FIDA Global"
              className="h-16 md:h-32 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-8">
            {/* ── Desktop Links pulled "out" ── */}
            <div className="hidden lg:flex items-center gap-12 mr-8">
              <Link
                href="/"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a8b8d0] hover:text-primary transition-all hover:scale-105"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-[10px] font-black uppercase tracking-[0.4em] text-[#a8b8d0] hover:text-primary transition-all hover:scale-105"
              >
                About Us
              </Link>
            </div>

            {/* Minimal trigger (On top bar) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-4 group"
            >
              <span className="hidden md:block text-sm font-bold uppercase tracking-widest text-[#a8b8d0] group-hover:text-primary transition-colors">Menu</span>
              <div className="w-12 h-12 glass rounded-full border border-white/10 flex items-center justify-center text-white group-hover:border-primary/40 transition-smooth group-hover:scale-110">
                <Menu className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Floating Menu Trigger (Fixed, appears on scroll) ── */}
      <AnimatePresence>
        {isScrolled && !menuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            onClick={() => setMenuOpen(true)}
            className="fixed top-8 right-8 z-50 w-14 h-14 glass rounded-full border border-white/20 flex items-center justify-center text-white shadow-2xl hover:border-primary/50 hover:scale-110 transition-smooth"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Side Menu Drawer (Right Side) ────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#0b1120]/80 backdrop-blur-md"
            />

            {/* Content Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-full max-w-[420px] bg-[#0f172a] border-l border-white/5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 flex items-center justify-between border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Navigation</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-red-500/50 hover:text-red-500 transition-smooth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable links area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 py-12 space-y-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.2 }}
                  >
                    <Link
                      href={link.href}
                      target={(link as any).isExternal ? "_blank" : undefined}
                      rel={(link as any).isExternal ? "noopener noreferrer" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between py-4 border-b border-white/5 transition-smooth"
                    >
                      <span className="text-3xl md:text-4xl font-bold text-white group-hover:text-primary transition-colors">
                        {link.name}
                      </span>
                      <ArrowRight className="w-6 h-6 text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                <div className="space-y-6">
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Have a project in mind? Let&apos;s build something intelligent together.
                  </p>
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full gradient-green py-5 rounded-2xl text-white font-bold text-lg hover:scale-[1.02] transition-smooth group"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
