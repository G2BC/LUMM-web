import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  const sites = {
    production: "https://lumm.uneb.br",
    staging: "https://lumm-web.onrender.com",
    development: "http://localhost:5173",
  };

  const site = (sites[mode as keyof typeof sites] ?? sites.development).replace(/\/+$/, "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      sitemap({
        hostname: site,
        generateRobotsTxt: true,
        robots: [
          isProd
            ? {
                userAgent: "*",
                allow: "/",
              }
            : {
                userAgent: "*",
                disallow: "/",
              },
        ],
        i18n: {
          languages: ["pt", "en", "es", "fr"],
          defaultLanguage: "pt",
          strategy: "prefix",
        },
      }),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: { enabled: false },
        manifest: {
          name: "LUMM - Luminescent Mushrooms",
          short_name: "LUMM",
          description: "Banco de dados científico sobre fungos luminescentes.",
          start_url: "/",
          scope: "/",
          theme_color: "#0a100b",
          background_color: "#0a100b",
          lang: "pt-BR",
          display: "standalone",
          icons: [
            {
              purpose: "maskable",
              sizes: "512x512",
              src: "lumm512.png",
              type: "image/png",
            },
            { purpose: "any", sizes: "512x512", src: "lumm512_rounded.png", type: "image/png" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api(\/|$)/, /^\/openapi\.json$/],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },

            {
              urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts",
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },

            {
              urlPattern: ({ url, request }) =>
                url.pathname.startsWith("/api/") &&
                request.method === "GET" &&
                !/^\/api\/(auth)(\/|$)/.test(url.pathname),
              handler: "NetworkFirst",
              options: {
                cacheName: "api",
                networkTimeoutSeconds: 3,
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              },
            },

            // 4) (opcional) API de outra origem
            // {
            //   urlPattern: /^https:\/\/api\.lumm\.uneb\.br\/v1\/.*/i,
            //   handler: "NetworkFirst",
            //   options: { cacheName: "api-xorigin" }
            // }
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
