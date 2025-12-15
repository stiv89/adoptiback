import type { MetadataRoute } from "next";

// Use production URL by default; override with NEXT_PUBLIC_SITE_URL if needed.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adopti.app";

const staticPaths = [
  "/",
  "/pets",
  "/pets/dogs",
  "/pets/cats",
  "/como-adoptar",
  "/publicar",
  "/login",
  "/register",
  "/about",
  "/contacto",
  "/search",
  "/profile",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.8,
  }));
}

