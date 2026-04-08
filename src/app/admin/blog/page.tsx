"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Edit2, Trash2, ExternalLink, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blogs?admin=true");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (post.cat && post.cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const deletePost = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      // In a real app, you'd call a DELETE API route here
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-sm font-medium">Loading content library...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-[var(--text-secondary)] mt-1">Manage your blog posts, case studies, and news.</p>
        </div>
        <Link 
          href="/admin/blog/create"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--green)] to-[var(--green-dark)] text-white font-bold transition-smooth hover:scale-[1.02] shadow-lg shadow-[var(--green-glow)]"
        >
          <Plus size={20} />
          Create New Post
        </Link>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--green)] transition-smooth" size={18} />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--grey-dark)] rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[var(--green)] transition-smooth text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-[var(--grey-dark)] hover:bg-[var(--bg-elevated)] transition-smooth text-sm font-medium">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Posts Table */}
      <div className="glass rounded-3xl border border-[var(--grey-dark)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--bg-elevated)]/50 border-b border-[var(--grey-dark)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Post Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Category</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--grey-dark)]">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                  <motion.tr 
                    key={post.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group hover:bg-[var(--bg-elevated)]/30 transition-smooth"
                  >
                    <td className="px-6 py-5">
                      <div className="max-w-md">
                        <p className="font-bold text-sm group-hover:text-[var(--green)] transition-smooth truncate">{post.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Author: {post.author}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-semibold px-3 py-1 bg-[var(--bg-elevated)] rounded-full text-[var(--text-secondary)]">
                        {post.cat}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-[var(--text-muted)]">{new Date(post.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${post.status === 'Published' ? 'bg-[var(--green-glow)] text-[var(--green)]' : 'bg-orange-500/10 text-orange-400'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blog/${post.id}`} target="_blank" className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--blue)]" title="Preview">
                          <ExternalLink size={16} />
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-[var(--green)]" title="Edit">
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-smooth text-[var(--text-muted)] hover:text-red-400" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[var(--text-muted)]">No posts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
