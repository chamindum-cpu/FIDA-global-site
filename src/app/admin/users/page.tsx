"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  Edit2,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function UsersAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const activeCount = users.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">System Users</h2>
          <p className="text-[var(--text-muted)] mt-1">Manage administrative access and team permissions.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--green)] text-black font-bold hover:scale-[1.02] transition-smooth active:scale-95">
          <UserPlus size={18} />
          Create User
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: users.length.toString(), icon: Users, color: "var(--blue)" },
          { label: "Active Now", value: activeCount.toString(), icon: ShieldCheck, color: "var(--green)" },
          { label: "Pending Invites", value: "0", icon: Mail, color: "var(--text-muted)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5" style={{ color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Container */}
      <div className="glass rounded-[2.5rem] border border-white/5 overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.01]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              className="w-full bg-[var(--bg-elevated)] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--green)]/50 transition-smooth"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
            {activeCount} Active Staff Members
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-xs font-bold tracking-[0.2em] uppercase">Fetching Personnel Access...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">User</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5">Joined</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-white/5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase())).map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-smooth">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--grey-dark)] to-[var(--bg-surface)] flex items-center justify-center font-bold text-white border border-white/10 uppercase">
                          {user.username[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user.username}</p>
                          <p className="text-[var(--text-muted)] text-xs mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-[var(--green)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        user.status === 'Active' ? 'bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20' : 'bg-white/5 text-[var(--text-muted)]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-smooth">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-smooth">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
