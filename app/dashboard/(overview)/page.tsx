// import { Card } from '@/app/ui/dashboard/cards'; vamos a agrupar para no hacer un suspense por carta ya que generara un efecto no deseado, de estallido popping
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { 
  //fetchRevenue, eliminamos para mover al componente y asi poder usar el suspense hasta que el fetching termine
  // fetchLatestInvoices, lo mismo para ponerle el suspense al componente
  // fetchCardData 
} from '../../lib/data';
import CardWrapper from '@/app/ui/dashboard/cards';

import { Suspense } from 'react'; // este envuelve el componente que demora
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons'; // este da un componente alternativo o fallback para mostrar hasta q cargue
 
export default async function Page() {
 // const revenue = await fetchRevenue();
 // const latestInvoices = await fetchLatestInvoices();
  /* const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData(); */
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
     {/*    <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
         <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper /> {/* ahora este paso a ser el componente en vez de carta por carta y a este lo ponemos como suspense */}
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}/> asi era antes cuando usamos el loading.tsx q engloba todo */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        {/* <LatestInvoices latestInvoices={latestInvoices} /> quedo viejo sin suspense */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

// DIFERENTES STREAMINGS, COMPONENTES QUE DEPENDEN DE PEDIR DATA
// You could stream the whole page like we did with loading.tsx... but that may lead to a longer loading time if one of the components has a slow data fetch.
// You could stream every component individually... but that may lead to UI popping into the screen as it becomes ready.
// You could also create a staggered effect by streaming page sections. But you'll need to create wrapper components.

// it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.

// By moving data fetching down to the components that need it, you can create more granular Suspense boundaries. This allows you to stream specific components and prevent the UI from blocking.

// CONCLUSION DE Streaming and Server Components give us new ways to handle data fetching and loading states, ultimately with the goal of improving the end user experience.