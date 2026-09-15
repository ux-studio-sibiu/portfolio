import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default is bottom-left, which is exactly where the section rail puts its
  // menu button — the badge sits over it and swallows the click in dev.
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
