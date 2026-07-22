'use client';

export default function AdminStyles() {
  return (
    <style jsx global>{`
      /* Reset public navbar/footer for admin area */
      nav, footer {
        display: none !important;
      }
      body {
        background-color: #f8f9fa;
      }
    `}</style>
  );
}
