import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
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
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "peauxhtyejfsmorvpqva.supabase.co",
        pathname: "/storage/v1/object/public/**",
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
      // Common crawler / old-path mistakes → real pages (stops Search Console 404s)
      {
        source: "/product/:id",
        destination: "/products/:id",
        permanent: true,
      },
      {
        source: "/products/category/:slug",
        destination: "/products/:slug",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/rss",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // Favicon / PWA aliases crawlers request by default
      {
        source: "/apple-touch-icon.png",
        destination: "/apple-icon.png",
        permanent: true,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-icon.png",
        permanent: true,
      },
      {
        source: "/favicon-16x16.png",
        destination: "/favicon-48.png",
        permanent: true,
      },
      {
        source: "/favicon-32x32.png",
        destination: "/favicon-48.png",
        permanent: true,
      },
      {
        source: "/manifest.webmanifest",
        destination: "/site.webmanifest",
        permanent: true,
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
