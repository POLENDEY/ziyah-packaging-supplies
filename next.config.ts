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
      // Old query filters → clean sitelink category pages
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "Bento Boxes" }],
        destination: "/products/bento-boxes",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "Hard Bento Clear" }],
        destination: "/products/hard-bento-clear",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "Hard Bento Black" }],
        destination: "/products/hard-bento-black",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "Round Sushi Trays" }],
        destination: "/products/round-sushi-trays",
        permanent: true,
      },
      {
        source: "/products",
        has: [
          { type: "query", key: "category", value: "Rectangular Sushi Trays" },
        ],
        destination: "/products/rectangular-sushi-trays",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
