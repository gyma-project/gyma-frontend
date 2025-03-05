import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["avatar.iran.liara.run", "localhost"],
  },
};

export default nextConfig;
