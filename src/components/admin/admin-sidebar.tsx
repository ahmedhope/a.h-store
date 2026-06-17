"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Tags, Store, Users, Settings, Percent, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const links = [
  { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الفئات", icon: Tags },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/coupons", label: "أكواد الخصم", icon: Percent },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-border/50">
        <Link href="/admin/dashboard" className="text-lg font-bold tracking-tight gradient-heading">a&h — إدارة</Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? "bg-gradient-to-l from-primary to-chart-4 text-primary-foreground font-medium shadow-md" : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50 space-y-1.5">
        <Link href="/">
          <Button variant="outline" size="sm" className="w-full justify-start rounded-xl gap-2 border-border/50">
            <Store className="h-4 w-4" />
            المتجر
          </Button>
        </Link>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <LogOut className="h-4 w-4" />
          تسجيل خروج
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header + toggle */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 h-14 bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <Link href="/admin/dashboard" className="text-lg font-bold gradient-heading">a&h — إدارة</Link>
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 flex flex-col">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-l border-border/50 bg-background/95 backdrop-blur-xl min-h-screen flex-col shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
