"use client";

export default function AdminStyles() {
  return (
    <style jsx global>{`
      nav:not(.admin-nav),
      footer,
      [class*="ChatBot"] {
        display: none !important;
      }
      body {
        background: linear-gradient(160deg, #f4eef5 0%, #faf7fb 40%, #fff 100%);
      }
    `}</style>
  );
}
