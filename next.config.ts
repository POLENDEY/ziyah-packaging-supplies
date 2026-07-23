import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.magnific.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.magnific.com",
        pathname: "/**",
      },
    ],
  },
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
