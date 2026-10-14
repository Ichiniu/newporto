"use client";

import React, { useState } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { portfolioData } from "@/data/portfolio";
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";

import { useLanguage } from "@/context/LanguageContext";

export const Contact = () => {
  const { lang, t } = useLanguage();
  const { email, location, github, linkedin, instagram, whatsapp } = portfolioData[lang].personalInfo;

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    // Gunakan Environment Variable Vercel, jika tidak terbaca gunakan token langsung di bawah ini
    const token = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN || "MASUKKAN_ACCESS_KEY_WEB3FORMS_DISINI";

    if (!token || token === "MASUKKAN_ACCESS_KEY_WEB3FORMS_DISINI") {
      alert(lang === "id"
        ? "Konfigurasi pengiriman belum lengkap. Mohon isi token Web3Forms Anda langsung di file src/components/Contact.tsx atau atur Environment Variable di Vercel."
        : "Submission configuration is incomplete. Please fill in your Web3Forms token directly in the src/components/Contact.tsx file or set the Environment Variable in Vercel.");
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
          subject: lang === "id" ? `Pesan Baru Portofolio dari ${formData.name}` : `New Portfolio Message from ${formData.name}`,
          from_name: lang === "id" ? "Developer Portofolio" : "Portfolio Developer",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(result.message || (lang === "id" ? "Gagal mengirim pesan. Silakan coba lagi." : "Failed to send message. Please try again."));
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
        alert(lang === "id"
        ? "Terjadi kesalahan koneksi. Silakan hubungi langsung via WhatsApp atau Email."
        : "Connection error occurred. Please contact directly via WhatsApp or Email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 px-4 sm:px-6 md:px-12 xl:px-24 relative overflow-hidden bg-[var(--color-bg)]">
      {/* Background Glow */}

      <div className="max-w-6xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col gap-2 mb-8 md:mb-12 text-center items-center">
          <span className="text-xs md:text-sm font-semibold tracking-wider text-text  font-mono uppercase">{t("contactTitle")}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">{t("contactSubtitle")}</h2>
          <div className="w-12 h-1 bg-primary rounded-full mt-1" />
        </div>

        {/* Layout: Left Column Contact Card & Info, Right Column Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <Card className="h-full flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)]">{t("collaborate")}</h3>
                <p className="text-[var(--color-text)] text-sm md:text-base leading-relaxed">
                  {t("collaborateDesc")}
                </p>
              </div>

              {/* Direct Info (2 Kolom di Mobile, 1 Kolom Penuh di Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4">
                <a
                  href={`mailto:${email}`}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-[var(--color-bg)] hover:bg-bg  border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-text  transition-all group min-h-[44px] min-w-0"
                  id="link-mail-direct"
                >
                  <div className="p-1.5 sm:p-3 rounded-lg bg-surface-soft text-text shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col min-w-0 w-full">
                    <span className="text-[9px] sm:text-xs text-[var(--color-text)] font-mono leading-none mb-0.5">Email</span>
                    <span className="text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10.5px] sm:text-sm lg:text-base font-semibold font-mono whitespace-nowrap overflow-hidden text-ellipsis block leading-tight">{email}</span>
                  </div>
                </a>

                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-[var(--color-bg)] hover:bg-bg  border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-text  transition-all group min-h-[44px] min-w-0"
                    id="link-whatsapp-direct"
                  >
                    <div className="p-1.5 sm:p-3 rounded-lg bg-surface-soft text-text shrink-0">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 w-full">
                      <span className="text-[9px] sm:text-xs text-[var(--color-text)] font-mono leading-none mb-0.5">WhatsApp</span>
                      <span className="text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10.5px] sm:text-sm lg:text-base font-semibold font-mono whitespace-nowrap overflow-hidden text-ellipsis block leading-tight">+62 896-4926-1851</span>
                    </div>
                  </a>
                )}

                <div className="col-span-2 lg:col-span-1 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)]">
                  <div className="p-2 sm:p-3 rounded-lg bg-surface-soft text-text shrink-0">
                    <MapPin data-tone="secondary" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] sm:text-xs text-[var(--color-text)] font-mono">{t("locationLabel")}</span>
                    <span className="text-xs sm:text-base font-semibold font-mono">{location}</span>
                  </div>
                </div>
              </div>

              {/* Social links row */}
              <div className="flex items-center gap-3 sm:gap-4 pt-6 border-t border-[var(--color-surface-soft)]">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all"
                  title="GitHub Profile"
                  id="link-github-contact"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all"
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
                    className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all"
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
                  <div className="p-4 rounded-full bg-surface-soft text-text  animate-pulse">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--color-text)]">{t("messageSent")}</h3>
                  <p className="text-[var(--color-text)] max-w-sm">
                    {t("messageSentDesc")}
                  </p>
                  <Button
                    id="btn-send-another"
                    variant="glow"
                    onClick={() => setIsSent(false)}
                    className="mt-4"
                  >
                    {t("sendAnother")}
                  </Button>
                </motion.div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label htmlFor="input-name" className="text-xs font-mono text-[var(--color-text)] uppercase tracking-wider">{t("yourName")}</label>
                      <input
                        type="text"
                        id="input-name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t("enterName")}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] placeholder-text focus:border-primary-hover transition-all text-xs sm:text-base font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label htmlFor="input-email" className="text-xs font-mono text-[var(--color-text)] uppercase tracking-wider">{t("emailAddress")}</label>
                      <input
                        type="email"
                        id="input-email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t("enterEmail")}
                        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] placeholder-text focus:border-primary-hover transition-all text-xs sm:text-base font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="input-message" className="text-xs font-mono text-[var(--color-text)] uppercase tracking-wider">{t("messageLabel")}</label>
                    <textarea
                      id="input-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("typeMessage")}
                      className="px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] placeholder-text   focus:border-primary-hover transition-all text-sm md:text-base font-sans resize-none"
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
                        <div className="w-5 h-5 border-2 border-primary-hover border-t-transparent rounded-full animate-spin" />
                        <span>{t("sending")}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t("sendMessage")}</span>
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
