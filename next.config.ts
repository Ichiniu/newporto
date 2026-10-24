import type { NextConfig } from "next";

const development = process.env.NODE_ENV === "development";
const captchaSources = "https://hcaptcha.com https://*.hcaptcha.com";
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next's prerendered hydration uses inline scripts; eval is allowed only in development.
  `script-src 'self' 'unsafe-inline' ${development ? "'unsafe-eval'" : ""} ${captchaSources}`,
  `style-src 'self' 'unsafe-inline' ${captchaSources}`,
  `img-src 'self' data: blob: ${captchaSources}`,
  "font-src 'self'",
  `connect-src 'self' https://api.web3forms.com ${captchaSources}${development ? " ws: wss:" : ""}`,
  `frame-src ${captchaSources}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(!development ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ...(!development ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }] : []),
      ],
    }];
  },
};

export default nextConfig;
