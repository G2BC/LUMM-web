import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const localizedPublicSlugs = [
    "",
    "explorar",
    "sobre",
    "publicacoes",
    "distribuicao",
    "contato",
    "colaboradores",
  ];
  const localizedPublicRoutes = ["pt", "en"].flatMap((lang) =>
    localizedPublicSlugs.map((slug) => (slug ? `/${lang}/${slug}` : `/${lang}`))
  );

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
        dynamicRoutes: localizedPublicRoutes,
        readable: true,
        changefreq: {
          "/": "weekly",
          "*": "monthly",
        },
        priority: {
          "/": 1,
          "/pt": 0.9,
          "/en": 0.9,
          "*": 0.7,
        },
        generateRobotsTxt: true,
        robots: [
          isProd
            ? {
                userAgent: "*",
                allow: "/",
                disallow: ["/painel", "/trocar-senha", "/pt/painel", "/en/painel"],
              }
            : {
                userAgent: "*",
                disallow: "/",
              },
        ],
      }),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: { enabled: false },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          globPatterns: ["**/*.{js,css,svg,png,webp,woff2}"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-pages",
                networkTimeoutSeconds: 5,
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === "script" || request.destination === "style",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-assets",
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
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
                url.hostname === "api.lumm.uneb.br" &&
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
          ],
        },
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
        includeAssets: ["sitemap.xml", "robots.txt", "manifest.webmanifest", "favicon.ico"],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
