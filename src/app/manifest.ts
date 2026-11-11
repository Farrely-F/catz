import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, THEME_COLOR } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Catz: cat training",
    short_name: "Catz",
    description: SITE_DESCRIPTION,
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    background_color: "#FFFFFF",
    theme_color: THEME_COLOR,
    categories: ["lifestyle", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Continue training", short_name: "Train", url: "/app/path", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Open the clicker", short_name: "Clicker", url: "/app/clicker", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
