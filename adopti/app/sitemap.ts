import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

