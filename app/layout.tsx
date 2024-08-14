import "@/app/ui/global.css"; // good practice to add it to your top-level component. In Next.js, this is the root layout (more on this later).

// este aunque no tiene tailwind agregado al ser el layout que engloba al page.tsx le aplica el tailwind que si page tiene las utility classes

import { inter } from "@/app/ui/fonts"; //apply globally

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

// This is called a root layout and is required. Any UI you add to the root layout will be shared across all pages in your application. You can use the root layout to modify your <html> and <body> tags, and add metadata