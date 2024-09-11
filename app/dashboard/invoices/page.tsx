import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';

// Your search functionality will span the client and the server. When a user searches for an invoice on the client, the URL params will be updated, data will be fetched on the server, and the table will re-render on the server with the new data.

//? There are a couple of benefits of implementing search with URL params:

//* Bookmarkable and Shareable URLs: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.
//* Server-Side Rendering and Initial Load: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.
//* Analytics and Tracking: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.

//? These are the Next.js client hooks that you'll use to implement the search functionality:

//* useSearchParams- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
//* usePathname - Lets you read the current URL's pathname. For example, for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
//* useRouter - Enables navigation between routes within client components programmatically. There are multiple methods you can use.

//! Here's a quick overview of the implementation steps:

//* Capture the user's input.
//* Update the URL with the search params.
//* Keep the URL in sync with the input field.
//* Update the table to reflect the search query.
 
export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    //! When to use the useSearchParams() hook vs. the searchParams prop?

    // You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

    //* <Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
    //* <Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
    //! As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.

    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const totalPages = await fetchInvoicesPages(query); // le pasamos la consulta y cuenta las paginas para esa consulta en particular, por ejemplo si buscamos 'pending' y hay 15 en la BD, como muestra 6 x pag serian 3 paginas. la ultima de 3 items.

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> 
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}