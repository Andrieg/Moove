import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@moove/types", "@moove/api-client"],
  async rewrites() {
    return [
      {
        source: "/legacy/:path*",
        destination: `${process.env.LEGACY_API_URL || "http://127.0.0.1:3005"}/:path*",
      },
    ];
  },
};

export default nextConfig;
