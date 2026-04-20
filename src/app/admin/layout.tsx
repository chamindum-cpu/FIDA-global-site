"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Users, BarChart3, Briefcase, Award, Lightbulb, MessageSquare, Layout, Bot } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Fallback
      window.location.href = "/admin/login";
    }
  };

  if (isLoginPage) {
    return <div className="admin-theme">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] admin-theme">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--grey-dark)] bg-[var(--bg-surface)] fixed h-screen z-20 flex flex-col">
        <div className="p-8 shrink-0">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--green)] to-[var(--blue)] flex items-center justify-center shadow-lg shadow-[var(--green-glow)]">
              <span className="font-bold text-white text-xl">F</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">FIDA</h1>
              <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarLink href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={pathname === "/admin"} />
          <div className="mt-8 mb-2 px-4">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-semibold">Content</p>
          </div>
          <SidebarLink href="/admin/blog" icon={<FileText size={20} />} label="Manage Blogs" active={pathname.startsWith("/admin/blog")} />
          <SidebarLink href="/admin/projects" icon={<Briefcase size={20} />} label="Manage Projects" active={pathname.startsWith("/admin/projects")} />
          <SidebarLink href="/admin/expertise" icon={<Award size={20} />} label="Our Expertise" active={pathname.startsWith("/admin/expertise")} />
          <SidebarLink href="/admin/services" icon={<Layout size={20} />} label="Manage Services" active={pathname.startsWith("/admin/services")} />
          <SidebarLink href="/admin/features" icon={<Lightbulb size={20} />} label="Manage Features" active={pathname.startsWith("/admin/features")} />
          <SidebarLink href="/admin/testimonials" icon={<MessageSquare size={20} />} label="Testimonials" active={pathname.startsWith("/admin/testimonials")} />
          <SidebarLink href="/admin/inquiries" icon={<MessageSquare size={20} />} label="Inquiries" active={pathname.startsWith("/admin/inquiries")} />
          <SidebarLink href="/admin/teams" icon={<Users size={20} />} label="Team Showcase" active={pathname.startsWith("/admin/teams")} />
          <SidebarLink href="/admin/solutions" icon={<Briefcase size={20} />} label="System Solutions" active={pathname.startsWith("/admin/solutions")} />
          <SidebarLink href="/admin/customers" icon={<Users size={20} />} label="Manage Customers" active={pathname.startsWith("/admin/customers")} />
          <SidebarLink href="/admin/careers" icon={<Briefcase size={20} />} label="Manage Careers" active={pathname.startsWith("/admin/careers")} />
          
          <div className="mt-8 mb-2 px-4">
            <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest font-semibold">System</p>
          </div>
          <SidebarLink href="/admin/ai-knowledge" icon={<Bot size={20} />} label="AI Knowledge Base" active={pathname.startsWith("/admin/ai-knowledge")} />
          <SidebarLink href="/admin/users" icon={<Users size={20} />} label="Users" active={pathname === "/admin/users"} />
          <SidebarLink href="/admin/analytics" icon={<BarChart3 size={20} />} label="Analytics" active={pathname === "/admin/analytics"} />
          <SidebarLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" active={pathname === "/admin/settings"} />
        </nav>

        <div className="p-4 shrink-0 border-t border-[var(--grey-dark)] bg-[var(--bg-surface)]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-smooth group"
          >
            <span className="text-[var(--text-muted)] group-hover:text-red-400 transition-smooth">
              <LogOut size={20} />
            </span>
            <span className="text-sm font-medium group-hover:text-[var(--text-primary)] transition-smooth">
              Exit Admin
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-smooth group ${active ? 'bg-[var(--bg-elevated)] text-[var(--green)]' : 'hover:bg-[var(--bg-elevated)]'}`}
    >
      <span className={`${active ? 'text-[var(--green)]' : 'text-[var(--text-muted)] group-hover:text-[var(--green)]'} transition-smooth`}>
        {icon}
      </span>
      <span className={`text-sm font-medium ${active ? 'text-[var(--text-primary)]' : 'group-hover:text-[var(--text-primary)]'} transition-smooth`}>
        {label}
      </span>
    </Link>
  );
}
