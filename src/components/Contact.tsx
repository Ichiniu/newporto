"use client";

import React, { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { portfolioData } from "@/data/portfolio";
import { Mail, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export const Contact = () => {
  const { email, github, linkedin, instagram, whatsapp } = portfolioData.personalInfo;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    const token = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN;

    if (!token) {
      alert("Konfigurasi pengiriman belum lengkap. Mohon atur NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN di file .env.local Anda.");
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: token,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Pesan Baru Portofolio dari ${formData.name}`,
          from_name: "Developer Portofolio",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(result.message || "Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Terjadi kesalahan koneksi. Silakan hubungi langsung via WhatsApp atau Email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--background)]">
      {/* Background Glow */}
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-12 text-center items-center">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-cyan-500 dark:text-cyan-400 font-mono uppercase">Hubungi</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">Hubungi Saya</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-1" />
        </div>

        {/* Layout: Left Column Contact Card & Info, Right Column Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <Card className="h-full flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)]">Mari Berkolaborasi!</h3>
                <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed">
                  Apakah Anda sedang mencari developer untuk menyelesaikan project Anda, membuat aplikasi kios, atau ingin berdiskusi?
                  Silakan hubungi saya kapan saja!
                </p>
              </div>

              {/* Direct Info */}
              <div className="space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-900 border border-[var(--card-border)] hover:border-cyan-500/20 text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group"
                  id="link-mail-direct"
                >
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-muted)] font-mono">Email</span>
                    <span className="text-sm md:text-base font-semibold font-mono">{email}</span>
                  </div>
                </a>

                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-900 border border-[var(--card-border)] hover:border-cyan-500/20 text-[var(--foreground)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group"
                    id="link-whatsapp-direct"
                  >
                    <div className="p-3 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-[var(--text-muted)] font-mono">Whatsapps</span>
                      <span className="text-sm md:text-base font-semibold font-mono">+62 896-4926-1851</span>
                    </div>
                  </a>
                )}
              </div>

              {/* Social links row */}
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-subtle)]">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-cyan-500/30 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all"
                  title="GitHub Profile"
                  id="link-github-contact"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-cyan-500/30 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all"
                  title="LinkedIn Profile"
                  id="link-linkedin-contact"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-cyan-500/30 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all"
                    title="Instagram Profile"
                    id="link-instagram-contact"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7">
            <Card className="h-full">
              {isSent ? (
                /* Success Message */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-8 gap-4"
                >
                  <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 animate-pulse">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">Pesan Terkirim!</h3>
                  <p className="text-[var(--text-muted)] max-w-sm">
                    Terima kasih telah menghubungi saya, Mas Ichsan. Saya akan segera membalas email Anda secepatnya.
                  </p>
                  <Button
                    id="btn-send-another"
                    variant="glow"
                    onClick={() => setIsSent(false)}
                    className="mt-4"
                  >
                    Kirim Pesan Lain
                  </Button>
                </motion.div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="input-name" className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Nama Anda</label>
                    <input
                      type="text"
                      id="input-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama Anda..."
                      className="px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm md:text-base font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="input-email" className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Alamat Email</label>
                    <input
                      type="email"
                      id="input-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Masukkan email Anda..."
                      className="px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm md:text-base font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="input-message" className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">Pesan</label>
                    <textarea
                      id="input-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ketik pesan Anda di sini..."
                      className="px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm md:text-base font-sans resize-none"
                    />
                  </div>

                  <Button
                    id="btn-submit-contact"
                    type="submit"
                    variant="primary"
                    disabled={isSending}
                    className="w-full mt-2"
                  >
                    {isSending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};
