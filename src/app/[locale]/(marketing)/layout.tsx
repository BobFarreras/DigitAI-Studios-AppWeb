import { Navbar } from '@/components/layout/Navbar';


export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* La Navbar aquí assegura que surt a TOTES les pàgines de màrqueting */}
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
}