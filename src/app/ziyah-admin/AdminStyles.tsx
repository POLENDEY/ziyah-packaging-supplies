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
        background: linear-gradient(160deg, #f7ecea 0%, #faf5f4 40%, #fff 100%);
      }
    `}</style>
  );
}
