import "@/app/ui/global.css"; // good practice to add it to your top-level component. In Next.js, this is the root layout (more on this later).

// este aunque no tiene tailwind agregado al ser el layout que engloba al page.tsx le aplica el tailwind que si page tiene las utility classes

import { inter } from "@/app/ui/fonts"; //apply globally

// --- //
//* metadata
import { Metadata } from 'next'; // include a metadata object from any layout.js or page.js file to add additional page information like title and description. Any metadata in layout.js will be inherited by all pages that use it.
 
// export const metadata: Metadata = { //Next.js will automatically add the title and metadata to your application.
//   title: 'Acme Dashboard',
//   description: 'The official Next.js Course Dashboard, built with App Router.',
//   metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
// };
 
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard', // agregamos un template para no repetir nombres en cada pagina, title.template field in the metadata object to define a template for your page titles. This template can include the page title, and any other information you want to include. 
    //* The %s in the template will be replaced with the specific page title.
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

//? But what if you want to add a custom title for a specific page? You can do this by adding a metadata object to the page itself. Metadata in nested pages will override the metadata in the parent. 
//* For example, in the /dashboard/invoices page, you can update the page title:


// --- //

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