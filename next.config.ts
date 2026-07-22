import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/ziyah-admin",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/ziyah-admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
