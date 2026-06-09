import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables the `use cache` directive + cacheLife/cacheTag (Cache Components).
  cacheComponents: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Faker person-portrait avatars used by the mock menu API.
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Restaurant banner photography.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
