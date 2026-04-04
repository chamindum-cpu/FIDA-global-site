"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const offices = [
  { city: "Dubai", country: "UAE (HQ)", address: "DIFC, Gate Village, Building 6", phone: "+971 4 123 4567", color: "var(--green)" },
  { city: "Nairobi", country: "Kenya", address: "Upper Hill, Upperhill Chambers", phone: "+254 20 123 4567", color: "var(--blue)" },
  { city: "Amsterdam", country: "Netherlands", address: "Zuidas, Gustav Mahlerlaan 10", phone: "+31 20 123 4567", color: "var(--grey-light)" },
  { city: "Riyadh", country: "Saudi Arabia", address: "King Fahd Road, Olaya District", phone: "+966 11 123 4567", color: "var(--green)" },
];

const services = [
  "IT Consultancy", "Infrastructure & Data Center", "Cybersecurity", "Cloud Services",
  "Managed IT Services", "AI & Data Analytics", "HR Automation (FIDA HR)", "Other",
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="py-20 container mx-auto px-6">
      <div className="grid lg:grid-cols-5 gap-14">

        {/* Left — form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-3"
        >
          {sent ? (
            <div className="glass rounded-3xl p-16 text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Message Received!</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Our team will get back to you within 24 hours. In the meantime, feel free to explore our services.
              </p>
              <button onClick={() => setSent(false)} className="px-8 py-3 rounded-full font-bold text-white gradient-green">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-10 space-y-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Send us a message</h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>We typically respond within 4 business hours.</p>

              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { id: "name", label: "Full Name", type: "text", placeholder: "John Smith" },
                  { id: "email", label: "Work Email", type: "email", placeholder: "john@company.com" },
                  { id: "company", label: "Company", type: "text", placeholder: "Acme Corporation" },
                ].map((f) => (
                  <div key={f.id} className={f.id === "company" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as Record<string, string>)[f.id]}
                      onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                      required
                      className="w-full rounded-xl px-5 py-3.5 text-sm transition-smooth focus:outline-none focus:ring-2"
                      style={{
                        background: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--grey-dark)",
                        // @ts-ignore
                        "--tw-ring-color": "var(--green)",
                      }}
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Service Interested In</label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full rounded-xl px-5 py-3.5 text-sm transition-smooth focus:outline-none focus:ring-2"
                    style={{ background: "var(--bg-elevated)", color: form.service ? "var(--text-primary)" : "var(--text-muted)", border: "1px solid var(--grey-dark)" }}
                  >
                    <option value="">Select a service...</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your project, challenge, or question..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full rounded-xl px-5 py-3.5 text-sm resize-none transition-smooth focus:outline-none focus:ring-2"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--grey-dark)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white gradient-green hover:scale-[1.02] transition-smooth shadow-lg"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </motion.div>

        {/* Right — info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Quick contact */}
          <div className="glass rounded-3xl p-8 space-y-5">
            <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Quick Contact</h3>
            {[
              { icon: Mail, label: "General Enquiries", value: "hello@fidaglobal.com", color: "var(--green)" },
              { icon: Mail, label: "Sales", value: "sales@fidaglobal.com", color: "var(--blue)" },
              { icon: Phone, label: "Global HQ", value: "+971 4 123 4567", color: "var(--green)" },
              { icon: Clock, label: "Support Hours", value: "24/7 for managed clients", color: "var(--grey-light)" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${c.color}15` }}>
                  <c.icon className="w-4 h-4" style={{ color: c.color }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{c.label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Offices */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Our Offices</h3>
            {offices.map((o) => (
              <div key={o.city} className="glass rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: o.color }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{o.city}, <span style={{ color: "var(--text-muted)" }}>{o.country}</span></p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{o.address}</p>
                  <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: o.color }}>
                    <Phone className="w-3 h-3" /> {o.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
