"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Image as ImageIcon, Loader2, Plus, AlertCircle, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateProject() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    categoryId: "",
    description: "",
    imageUrl: "",
    status: "Published",
  });

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id.toString() }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCats();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
        }),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create project.");
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
            href="/admin/projects" 
            className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Add New Project</h2>
            <p className="text-[var(--text-secondary)] mt-1">Showcase a new success story in your portfolio.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--blue)] to-[var(--blue-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--blue-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {loading ? "Adding..." : "Add Project"}
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
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Project Title</label>
              <input 
                type="text" 
                placeholder="Ex: National Cloud Migration..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-lg font-bold"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Ministry of Interior..." 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm"
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Category</label>
                  <select 
                    className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--text-muted)] ml-1">Project Description</label>
              <textarea 
                rows={6}
                placeholder="Tell the story of how you solved the client's problem..." 
                className="w-full bg-[var(--bg-elevated)] border border-[var(--grey-dark)] rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--blue)] transition-smooth text-sm resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon size={18} className="text-[var(--blue)]" />
              Featured Image
            </h3>
            
            <div className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[var(--grey-dark)] flex flex-col items-center justify-center gap-2 group hover:border-[var(--blue)] transition-smooth cursor-pointer bg-[var(--bg-elevated)]/30 overflow-hidden relative"
              >
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                      <Upload className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:text-[var(--blue)] transition-smooth">
                      <Plus size={24} />
                    </div>
                    <p className="text-xs font-medium text-[var(--text-muted)]">Upload Project Image</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8 space-y-6 border border-[var(--grey-dark)]">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
                {["Draft", "Published"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({...formData, status: s})}
                    className={`py-3 rounded-xl text-xs font-bold transition-smooth ${formData.status === s ? 'bg-[var(--blue-glow)] text-[var(--blue)] border border-[var(--blue)]/30' : 'bg-[var(--bg-elevated)] border border-transparent hover:border-[var(--grey-dark)] text-[var(--text-secondary)]'}`}
                  >
                    {s}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
