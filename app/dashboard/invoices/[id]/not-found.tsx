import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
 
export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
//! Perfect! <Page> will now throw an error if a specific invoice is not found. To show an error UI to the user. Create a not-found.tsx file inside the /edit folder.
// para hacer la UI de not-found a medida creamos el archivo not-found.tsx. este archivo se libera cuando desplegamos import { notFound } from 'next/navigation';
//? NOT FOUND TIENE PREDOMINANCIA QUE EL ERROR, ENTONCES EL NOT FOUND CORRERA PRIMERO, SIRVE PARA ESPECIFICAR MAS EL ERROR