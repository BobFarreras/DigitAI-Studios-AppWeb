"use client";

import { Link, usePathname } from "@/routing";
import {
  Home,
  Menu,
  LayoutDashboard,
  type LucideIcon,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  isDropdown?: boolean;
};

interface PublicMobileNavProps {
  user: User | null;
}

export function PublicMobileNav({ user }: PublicMobileNavProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isHomePage =
      pathname.replace(/^\/[a-z]{2}/, "") === "" || pathname === "/";

    if (isHomePage && href.includes("#")) {
      e.preventDefault();
      const id = href.split("#")[1];
      const element = document.getElementById(id);

      if (!element) return;
      setTimeout(() => {
        const offsetPosition =
          element.getBoundingClientRect().top + window.pageYOffset - 85;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.pushState(null, "", href);
      }, 100);
    }
  };

  const MENU_LINKS = [
    { href: "/#serveis", label: t("solutions") },
    { href: "/#contacte", label: t("contact") },
  ];

  const authItem: NavItem | null = user
    ? {
        id: "auth",
        label: t("dashboard"),
        href: "/dashboard",
        icon: LayoutDashboard,
      }
    : null;

  const NAV_ITEMS: NavItem[] = [
    { id: "home", label: t("home"), href: "/", icon: Home },
    {
      id: "solutions",
      label: t("solutions"),
      href: "#",
      icon: Menu,
      isDropdown: true,
    },
    ...(authItem ? [authItem] : []),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-safe transition-all duration-300">
      <div className="grid grid-cols-3 h-16 items-center">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.replace("/#", ""));
          const Icon = item.icon;
          const isAuthItem = item.id === "auth";

          if (item.isDropdown) {
            return (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger className="flex h-full w-full flex-col items-center justify-center gap-1 active:scale-95 transition-transform outline-none group focus:outline-none">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/35 bg-primary/10 shadow-[0_0_18px_rgba(139,92,246,0.18)]">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={2.6} />
                    <div className="absolute -right-1 -top-1 rounded-full border border-border bg-background p-px">
                      <ChevronUp className="h-2.5 w-2.5 text-primary" />
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground group-data-[state=open]:text-primary truncate w-full text-center px-1">
                    {item.label}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  align="center"
                  className="w-56 mb-4 p-2 bg-card/95 backdrop-blur-md border-border shadow-2xl rounded-xl z-[60]"
                >
                  {MENU_LINKS.map((subLink) => (
                    <DropdownMenuItem key={subLink.href} asChild>
                      <Link
                        href={subLink.href}
                        onClick={(e) => handleScrollToSection(e, subLink.href)}
                        className="w-full cursor-pointer text-sm py-2.5 px-2 font-medium rounded-lg focus:bg-primary/10 active:bg-primary/10"
                      >
                        {subLink.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) =>
                item.href.includes("#") && handleScrollToSection(e, item.href)
              }
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform",
                isActive
                  ? "text-primary"
                  : isAuthItem && user
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive && "fill-current/20 scale-110",
                  !isActive && isAuthItem && "opacity-80",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] truncate w-full text-center px-1",
                  isActive ? "font-bold" : "font-medium",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
