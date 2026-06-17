"use client";

import Link from "next/link";
import { ShoppingCart, Menu, Search, X, Sparkles, Moon, Sun, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/generated/prisma";

export function Navbar({ categories, settings }: { categories: Category[]; settings?: Record<string, string> }) {
  const [cartCount, setCartCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleDark() {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  }
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updateCart = useCallback(() => {
    try {
      const cart = JSON.parse(document.cookie.split("cart=")[1]?.split(";")[0] || "[]");
      setCartCount(cart.reduce((s: number, i: any) => s + i.quantity, 0));
    } catch { setCartCount(0); }
  }, []);

  useEffect(() => {
    updateCart();
    window.addEventListener("focus", updateCart);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("focus", updateCart);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [updateCart]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) router.push(`/?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled
        ? "glass-strong"
        : "bg-transparent"
    }`}>
      <div className="container-store flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold tracking-tight relative group">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary via-chart-4 to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Store className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <span className="gradient-heading">a&h</span>
          <span className="text-muted-foreground font-light">store</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="nav-link px-4 py-2 text-foreground/80 hover:text-foreground">
            الرئيسية
          </Link>
          <Link href="/products" className="nav-link px-4 py-2 text-foreground/80 hover:text-foreground">
            جميع المنتجات
          </Link>
          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.id} href={`/?category=${cat.slug}`} className="nav-link px-4 py-2 text-foreground/80 hover:text-foreground">
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-1.5">
          <form onSubmit={handleSearch} className={`items-center gap-1 transition-all duration-300 ${showSearch ? "flex absolute inset-x-4 top-2 z-50 md:relative md:inset-auto animate-scale-in" : "hidden md:flex"}`}>
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input ref={searchRef} placeholder="ابحث عن منتج..." className="h-10 pr-10 w-full md:w-56 lg:w-72 rounded-2xl bg-muted/60 border-border/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-300" dir="rtl" />
            </div>
            {showSearch && (
              <Button type="button" variant="ghost" size="icon" className="md:hidden shrink-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => setShowSearch(false)}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </form>
          <Button variant="ghost" size="icon" className="icon-btn md:hidden" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleDark} className="icon-btn hidden md:inline-flex" title={dark ? "وضع النهار" : "وضع الليل"}>
            <div className="relative">
              <Sun className={`h-[18px] w-[18px] transition-all duration-500 ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75 absolute"}`} />
              <Moon className={`h-[18px] w-[18px] transition-all duration-500 ${!dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75 absolute"}`} />
            </div>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="icon-btn relative">
              <ShoppingCart className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-primary to-chart-4 text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg ring-2 ring-background animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="md:hidden icon-btn">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border/50">
                  <Link href="/" className="flex items-center gap-2 text-2xl font-bold" onClick={() => setMobileOpen(false)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-chart-4 to-accent flex items-center justify-center shadow-lg">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <span className="gradient-heading">a&h</span>
                    <span className="text-muted-foreground font-light">store</span>
                  </Link>
                </div>
                <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
                  <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-primary/5 hover:text-primary transition-all" onClick={() => setMobileOpen(false)}>
                    <Sparkles className="h-4 w-4 text-primary" />
                    الرئيسية
                  </Link>
                  <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-chart-4/5 hover:text-chart-4 transition-all" onClick={() => setMobileOpen(false)}>
                    <Store className="h-4 w-4 text-chart-4" />
                    جميع المنتجات
                  </Link>
                  <div className="pt-4 pb-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium px-4">الأقسام</p>
                  </div>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/?category=${cat.slug}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" onClick={() => setMobileOpen(false)}>
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/20 to-chart-4/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      {cat.name}
                    </Link>
                  ))}
                </nav>
                <div className="p-6 border-t border-border/50 space-y-3">
                  {settings && (settings.social_facebook || settings.social_instagram || settings.social_twitter || settings.social_youtube) && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {settings.social_facebook && (
                        <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-colors" title="فيسبوك">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      )}
                      {settings.social_instagram && (
                        <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 transition-colors" title="انستغرام">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                      )}
                      {settings.social_twitter && (
                        <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 transition-colors" title="تويتر">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                      {settings.social_youtube && (
                        <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="يوتيوب">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  )}
                  <Button onClick={toggleDark} variant="outline" className="w-full rounded-xl gap-2" size="sm">
                    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {dark ? "الوضع النهاري" : "الوضع الليلي"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
