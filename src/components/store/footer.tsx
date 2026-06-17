import Link from "next/link";
import { Store, ArrowLeft, Headphones, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export function Footer({ settings }: { settings?: Record<string, string> }) {
  return (
    <footer className="border-t border-primary/10 mt-auto bg-gradient-to-b from-background to-muted/30">
      <div className="container-store py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-chart-4 to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="gradient-heading">a&h</span>
              <span className="text-muted-foreground font-light">store</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              متجر a&h للأزياء — نقدم أحدث التشكيلات والملابس العصرية بأفضل الأسعار. تصاميم حصرية وجودة عالية.
            </p>
            {settings && (settings.social_facebook || settings.social_instagram || settings.social_twitter || settings.social_youtube || settings.social_tiktok || settings.social_snapchat || settings.social_telegram || settings.social_linkedin) && (
              <div className="flex flex-wrap gap-2">
                {settings.social_facebook && (
                  <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-blue-600/10 text-blue-600 hover:bg-blue-600/20" title="فيسبوك">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {settings.social_instagram && (
                  <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-pink-500/10 text-pink-500 hover:bg-pink-500/20" title="انستغرام">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {settings.social_twitter && (
                  <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-sky-500/10 text-sky-500 hover:bg-sky-500/20" title="تويتر">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {settings.social_youtube && (
                  <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-red-500/10 text-red-500 hover:bg-red-500/20" title="يوتيوب">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}
                {settings.social_tiktok && (
                  <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-[#FF0050]/10 text-[#FF0050] hover:bg-[#FF0050]/20" title="تيك توك">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.36 3.56 3.14 1.12-.13 2.07-.88 2.61-1.84.28-.5.43-1.06.42-1.62.03-2.32.01-4.63.02-6.95 0-.08.01-.17.02-.25h.01Z"/></svg>
                  </a>
                )}
                {settings.social_snapchat && (
                  <a href={settings.social_snapchat} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-[#FFFC00]/10 text-[#FFFC00] hover:bg-[#FFFC00]/20" title="سنت شات">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5.83 4.53c-.6.09-1.17.37-1.59.76-.45.41-.73.91-.83 1.5-.08.47-.08.59-.03 1.37.06.85.14 1.22.47 2.03.66 1.6 1.85 2.84 3.4 3.52.7.31 1.26.46 2.06.55.54.06.58.06.69.01.12-.05.22-.16.28-.3.07-.18.08-.2.08-.56 0-.43-.03-.54-.23-.85-.27-.41-.39-.75-.44-1.19-.03-.3-.01-.41.09-.56.16-.25.44-.33.8-.22.2.06.29.13.52.44.26.35.36.44.61.55.41.19.72.19 1.13 0 .27-.12.42-.25.64-.55.23-.31.32-.38.52-.44.36-.11.64-.03.8.22.1.15.12.26.09.56-.05.44-.17.78-.44 1.19-.2.31-.23.42-.23.85 0 .36.01.38.08.56.06.14.16.25.28.3.11.05.15.05.69-.01.8-.09 1.36-.24 2.06-.55 1.55-.68 2.74-1.92 3.4-3.52.33-.81.41-1.18.47-2.03.05-.78.05-.9-.03-1.37-.1-.59-.38-1.09-.83-1.5-.42-.39-.99-.67-1.59-.76-.48-.07-1.59-.09-5.16-.09s-4.68.02-5.16.09zM2.02 7.7c0 .3.24.54.54.54s.54-.24.54-.54-.24-.54-.54-.54-.54.24-.54.54zm18.88 0c0 .3.24.54.54.54s.54-.24.54-.54-.24-.54-.54-.54-.54.24-.54.54zM12 20.39c1.46 0 2.7-.31 3.94-.97l.37-.2v-.82c0-.79-.1-1.13-.38-1.32-.39-.27-.97-.29-1.55-.04-.82.35-1.56.49-2.38.49s-1.56-.14-2.38-.49c-.58-.25-1.16-.23-1.55.04-.28.19-.38.53-.38 1.32v.82l.37.2c1.24.66 2.48.97 3.94.97z"/></svg>
                  </a>
                )}
                {settings.social_telegram && (
                  <a href={settings.social_telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20" title="تيليجرام">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.24-1.861-.44-.752-.24-1.35-.37-1.297-.78.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </a>
                )}
                {settings.social_linkedin && (
                  <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md bg-blue-700/10 text-blue-700 hover:bg-blue-700/20" title="لينكد إن">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium mb-4 flex items-center gap-2 text-sm">
              <span className="w-1 h-4 bg-gradient-to-b from-primary to-chart-4 rounded-full inline-block" />
              روابط سريعة
            </p>
            <div className="space-y-3">
              <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group/link">
                <ArrowLeft className="h-3 w-3 opacity-0 -mr-1 group-hover/link:opacity-100 group-hover/link:mr-0 transition-all" />
                الرئيسية
              </Link>
              <Link href="/products" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-chart-4 transition-colors group/link">
                <ArrowLeft className="h-3 w-3 opacity-0 -mr-1 group-hover/link:opacity-100 group-hover/link:mr-0 transition-all" />
                جميع المنتجات
              </Link>
              <Link href="/cart" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent-foreground transition-colors group/link">
                <ArrowLeft className="h-3 w-3 opacity-0 -mr-1 group-hover/link:opacity-100 group-hover/link:mr-0 transition-all" />
                السلة
              </Link>
              <Link href="/order-lookup" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-chart-4 transition-colors group/link">
                <ArrowLeft className="h-3 w-3 opacity-0 -mr-1 group-hover/link:opacity-100 group-hover/link:mr-0 transition-all" />
                الاستعلام عن طلب
              </Link>
            </div>
          </div>
          <div>
            <p className="font-medium mb-4 flex items-center gap-2 text-sm">
              <span className="w-1 h-4 bg-gradient-to-b from-chart-4 to-accent rounded-full inline-block" />
              تواصل معنا
            </p>
            <div className="space-y-3">
              <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-chart-4 transition-colors group/link">
                <Headphones className="h-3.5 w-3.5 group-hover/link:rotate-12 transition-transform" />
                واتساب: {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"}
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                <span>شحن سريع — 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>إرجاع مجاني</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>دفع آمن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary/10 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
        <div className="container-store py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} <span className="text-primary font-medium">a&h store</span> — جميع الحقوق محفوظة</p>

        </div>
      </div>
    </footer>
  );
}
