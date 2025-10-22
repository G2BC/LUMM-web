import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";
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
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
