import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-4494058b-7bc3-49b0-8456-48b2d4655f47.space-z.ai",
    ".space-z.ai",
  ],
};

export default nextConfig;
