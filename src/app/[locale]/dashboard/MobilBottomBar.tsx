'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderKanban, Settings } from 'lucide-react'; // Afegit Info per si de cas
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Resum', href: '/dashboard' },
  { icon: FileText, label: 'Audits', href: '/dashboard/audits' },
  // Posa '#' o una ruta falsa per evitar que naveguin si no vols
  { icon: FolderKanban, label: 'Proves', href: '#proves' }, 
  { icon: Settings, label: 'Ajustos', href: '#ajustos' },
];

export function MobileBottomBar() {
  const pathname = usePathname();
  // const { toast } = useToast(); // Opcional

  const handleClick = (e: React.MouseEvent, href: string, label: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      // Aquí pots mostrar un toast o alerta
      // toast({ title: "Pròximament", description: `${label} estarà disponible aviat.` });
      alert(`${label} estarà disponible properament! 🚀`);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-colors duration-300">
        <div className="flex justify-around items-center h-16 px-2">
            {MENU_ITEMS.map((item) => {
                // Comprovem si està actiu (només per rutes reals, no #)
                const isActive = !item.href.startsWith('#') && pathname === item.href;
                const Icon = item.icon;

                return (
                    <Link 
                        // 🔑 CLAU CORREGIDA: Usem label en lloc de href per evitar duplicats
                        key={item.label} 
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href, item.label)}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon 
                            className={cn("w-6 h-6 transition-all", isActive && "fill-current/20 scale-110")} 
                            strokeWidth={isActive ? 2.5 : 2} 
                        />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    </div>
  );
}