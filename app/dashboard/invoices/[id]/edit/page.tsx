//! Dynamic Route Segment with the invoice id
//* Next.js allows you to create Dynamic Route Segments when you don't know the exact segment name and want to create routes based on data. This could be blog post titles, product pages, etc. You can create dynamic route segments by wrapping a folder's name in square brackets. For example, [id], [post] or [slug].

//* In your /invoices folder, create a new dynamic route called [id], then a new route called edit with a page.tsx file. Your file structure should look like this:

//? The updating invoice form is similar to the create an invoice form, except you'll need to pass the invoice id to update the record in your database. Let's see how you can get and pass the invoice id.

//? steps:

// 1 Create a new dynamic route segment with the invoice id.
// 2 Read the invoice id from the page params.
// 3 Fetch the specific invoice from your database.
// 4 Pre-populate the form with the invoice data.
// 5 Update the invoice data in your database.

import Form from '@/app/ui/invoices/edit-form'; // different form (from the edit-form.tsx file). This form should be pre-populated with a defaultValue for the customer's name, invoice amount, and status. To pre-populate the form fields, you need to fetch the specific invoice using id.
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';

import { notFound } from 'next/navigation'; // Now that you know the invoice doesn't exist in your database, let's use notFound to handle it.

import { Metadata } from 'next'; 

export const metadata: Metadata = {
    title: 'Invoice Edit',
  };

 
export default async function Page({ params }: { params: { id: string } }) { // In addition to searchParams, page components also accept a prop called params which you can use to access the id
    const id = params.id;
    const [invoice, customers] = await Promise.all([ // Promise.all to fetch both the invoice and customers in parallel
        fetchInvoiceById(id),
        fetchCustomers(),
      ]);
      if (!invoice) { // con este condicional si no existe invoice libera el notFound
        notFound();
      }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}