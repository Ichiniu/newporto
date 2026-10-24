"use client";

import React, { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { portfolioData } from "@/data/portfolio";
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/Icons";
import { motion, useScroll, type MotionStyle } from "framer-motion";
import assembly from "./ContactAssembly.module.css";

import { useLanguage } from "@/context/LanguageContext";

export const Contact = () => {
  const { lang, t } = useLanguage();
  const { email, location, github, linkedin, instagram, whatsapp } = portfolioData[lang].personalInfo;

  const contactCard = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contactCard, offset: ["start 95%", "end 95%"] });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [emailError, setEmailError] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [formError, setFormError] = useState("");
  const captcha = useRef<HCaptcha>(null);
  const submitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting.current || new FormData(e.currentTarget).get("botcheck")) return;
    const name = formData.name.trim();
    const message = formData.message.trim();
    setFormError("");
    if (!name || !message || name.length > 100 || message.length > 5000 || formData.email.trim().length > 254) {
      setFormError(lang === "id" ? "Lengkapi nama dan pesan sesuai batas panjang kolom." : "Please complete your name and message within the field limits.");
      return;
    }

    const emailTrimmed = formData.email.trim();
    const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(emailTrimmed);
    if (!isGmail) {
      setEmailError(lang === "id" ? "Alamat email harus menggunakan @gmail.com" : "Email must use @gmail.com domain");
      return;
    }
    setEmailError("");

    if (!captchaToken) {
      setFormError(lang === "id" ? "Selesaikan verifikasi keamanan terlebih dahulu." : "Please complete the security check first.");
      return;
    }

    const token = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN;
    if (!token || token === "MASUKKAN_ACCESS_KEY_WEB3FORMS_DISINI") {
      setFormError(lang === "id" ? "Form belum tersedia. Silakan hubungi melalui email atau WhatsApp." : "The form is unavailable. Please contact me by email or WhatsApp.");
      return;
    }

    submitting.current = true;
    setIsSending(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        signal: AbortSignal.timeout(15000),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: token,
          name,
          email: emailTrimmed,
          message,
          botcheck: false,
          "h-captcha-response": captchaToken,
          subject: lang === "id" ? `Pesan Baru Portofolio dari ${name}` : `New Portfolio Message from ${name}`,
          from_name: lang === "id" ? "Developer Portofolio" : "Portfolio Developer",
        }),
      });

      const result = await response.json();
      if (response.ok && result.success === true) {
        setIsSent(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setFormError(lang === "id" ? "Pesan belum terkirim. Verifikasi ulang lalu coba lagi, atau hubungi melalui email." : "Your message was not sent. Verify again and retry, or contact me by email.");
      }
    } catch {
      setFormError(lang === "id"
        ? "Koneksi bermasalah atau terlalu lama. Silakan coba lagi atau hubungi melalui WhatsApp atau email."
        : "The connection failed or timed out. Please retry or contact me by WhatsApp or email.");
    } finally {
      submitting.current = false;
      setIsSending(false);
      setCaptchaToken("");
      captcha.current?.resetCaptcha();
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
          <motion.div ref={contactCard} style={{ "--assembly": scrollYProgress } as MotionStyle} className={`${assembly.assembly} lg:col-span-5 flex flex-col justify-between gap-6`}>
            <Card animateEntrance={false} className="h-full flex flex-col justify-between gap-8">
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
                  className={`${assembly.piece} ${assembly.email} flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-[var(--color-bg)] hover:bg-bg  border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-text  transition-all group min-h-[44px] min-w-0`}
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
                    className={`${assembly.piece} ${assembly.whatsapp} flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-4 p-2.5 sm:p-4 rounded-xl bg-[var(--color-bg)] hover:bg-bg  border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-text  transition-all group min-h-[44px] min-w-0`}
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

                <div className={`${assembly.piece} ${assembly.location} col-span-2 lg:col-span-1 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)]`}>
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
                  className={`${assembly.piece} ${assembly.github} p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all`}
                  title="GitHub Profile"
                  id="link-github-contact"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${assembly.piece} ${assembly.linkedin} p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all`}
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
                    className={`${assembly.piece} ${assembly.instagram} p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] hover:border-primary-hover text-[var(--color-text)] hover:text-[var(--color-text)] transition-all`}
                    title="Instagram Profile"
                    id="link-instagram-contact"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </Card>
          </motion.div>

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
                <form onSubmit={handleSubmit} aria-busy={isSending} className="flex flex-col gap-4 sm:gap-5">
                  <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} aria-hidden="true" autoComplete="off" />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <label htmlFor="input-name" className="text-xs font-mono text-[var(--color-text)] uppercase tracking-wider">{t("yourName")}</label>
                      <input
                        type="text"
                        id="input-name"
                        maxLength={100}
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
                        maxLength={254}
                        required
                        pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                        title={lang === "id" ? "Alamat email harus menggunakan domain @gmail.com" : "Email must use @gmail.com domain"}
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (emailError) setEmailError("");
                        }}
                        placeholder="contoh@gmail.com"
                        className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] placeholder-text focus:border-primary-hover transition-all text-xs sm:text-base font-sans"
                      />
                      {emailError && (
                        <span className="text-[11px] sm:text-xs text-[var(--color-text)] font-mono font-medium">
                          {emailError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="input-message" className="text-xs font-mono text-[var(--color-text)] uppercase tracking-wider">{t("messageLabel")}</label>
                    <textarea
                      id="input-message"
                      maxLength={5000}
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("typeMessage")}
                      className="px-4 py-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-surface-soft)] text-[var(--color-text)] placeholder-text   focus:border-primary-hover transition-all text-sm md:text-base font-sans resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-mono text-[var(--color-text)]">
                      {lang === "id" ? "Verifikasi keamanan" : "Security check"}
                    </p>
                    <HCaptcha
                      ref={captcha}
                      sitekey="50b2fe65-b00b-4b9e-ad62-3ba471098be2"
                      reCaptchaCompat={false}
                      size="compact"
                      languageOverride={lang}
                      onVerify={(value) => { setCaptchaToken(value); setFormError(""); }}
                      onExpire={() => setCaptchaToken("")}
                      onError={() => {
                        setCaptchaToken("");
                        setFormError(lang === "id" ? "Verifikasi gagal dimuat. Muat ulang halaman atau hubungi melalui email atau WhatsApp." : "Verification could not load. Reload the page or contact me by email or WhatsApp.");
                      }}
                    />
                    {formError && <p role="alert" className="text-xs text-[var(--color-text)]">{formError}</p>}
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
