import SideNav from '@/app/ui/dashboard/sidenav';
export const experimental_ppr = true;
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

// One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. This is called partial rendering:

// el layout no se re renderiza.
// solo las paginas
// dentro de la carpeta/ruta dashboard el layout aqui engloba todas las carpetas, paginas, layouts que dependan de dashboard. pero si te vas un nivel mas arriba a la carpeta app no toma el layout.tsx de dashboard, solo para niveles mas adentro del arbol