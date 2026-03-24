import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.civitai.com",
      },
    ],
  },
};

export default nextConfig;
