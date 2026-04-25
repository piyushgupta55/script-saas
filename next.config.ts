import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist', 'pdf-parse', '@napi-rs/canvas'],
  },
};

export default nextConfig;
