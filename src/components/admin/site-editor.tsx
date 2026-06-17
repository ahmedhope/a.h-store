"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveSettings } from "@/actions/settings";
import { Bell, Settings2, Truck, RotateCcw, ShieldCheck, Headphones, Save, Image, Globe } from "lucide-react";

const ICONS = [
  { value: "Truck", label: "شاحنة" },
  { value: "RotateCcw", label: "إرجاع" },
  { value: "ShieldCheck", label: "درع" },
  { value: "Headphones", label: "سماعة" },
  { value: "Zap", label: "برق" },
  { value: "Star", label: "نجمة" },
  { value: "Heart", label: "قلب" },
  { value: "Package", label: "صندوق" },
  { value: "Clock", label: "ساعة" },
  { value: "Award", label: "جائزة" },
];

const GRADIENTS = [
  { value: "from-blue-500 to-blue-600", label: "أزرق" },
  { value: "from-green-500 to-emerald-600", label: "أخضر" },
  { value: "from-purple-500 to-violet-600", label: "بنفسجي" },
  { value: "from-amber-500 to-orange-600", label: "ذهبي" },
  { value: "from-red-500 to-rose-600", label: "أحمر" },
  { value: "from-primary to-chart-4", label: "الافتراضي" },
  { value: "from-teal-500 to-cyan-600", label: "سماوي" },
  { value: "from-pink-500 to-fuchsia-600", label: "وردي" },
];

export function SiteEditor({ settings }: { settings: Record<string, string> }) {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  // Proxy ensures any missing key returns "" instead of undefined (Base UI uncontrolled→controlled warning)
  const initial = new Proxy(settings, { get(t, k) { return (t as any)[k] ?? ""; } });

  async function handleSubmit(form: FormData) {
    setMsg(""); setError("");
    const res = await saveSettings(form);
    if (res?.error) setError(res.error);
    else setMsg("✅ تم حفظ الإعدادات");
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Announcement */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />الإعلان العلوي</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" name="announcement_active" defaultChecked={initial.announcement_active === "true"} className="rounded border-gray-300 h-5 w-5" />
            <Label>تفعيل الإعلان</Label>
          </div>
          <div className="space-y-2">
            <Label>نص الإعلان</Label>
            <Input name="announcement_text" defaultValue={initial.announcement_text} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>لون الخلفية</Label>
              <select name="announcement_bg" defaultValue={initial.announcement_bg} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                {GRADIENTS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>لون النص</Label>
              <select name="announcement_textColor" defaultValue={initial.announcement_textColor} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                <option value="text-white">أبيض</option>
                <option value="text-black">أسود</option>
                <option value="text-primary">اللون الأساسي</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${initial[`feature_${i}_color`] || "from-gray-400 to-gray-500"} flex items-center justify-center`}>
                <Settings2 className="h-4 w-4 text-white" />
              </div>
              الميزة {i}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الأيقونة</Label>
                <select name={`feature_${i}_icon`} defaultValue={initial[`feature_${i}_icon`]} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  {ICONS.map((ic) => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>لون الخلفية</Label>
                <select name={`feature_${i}_color`} defaultValue={initial[`feature_${i}_color`]} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">
                  {GRADIENTS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input name={`feature_${i}_title`} defaultValue={initial[`feature_${i}_title`]} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>النص</Label>
              <Input name={`feature_${i}_desc`} defaultValue={initial[`feature_${i}_desc`]} className="rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Hero Section */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><Image className="h-5 w-5 text-primary" />القسم العلوي (Hero)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>الشعار المميز (Badge)</Label>
            <Input name="hero_badge" defaultValue={initial.hero_badge} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>العنوان الرئيسي</Label>
            <Input name="hero_title" defaultValue={initial.hero_title} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>النص الفرعي</Label>
            <Textarea name="hero_subtitle" defaultValue={initial.hero_subtitle} className="rounded-xl" rows={3} />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" />روابط التواصل الاجتماعي</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>فيسبوك</Label>
            <Input name="social_facebook" defaultValue={initial.social_facebook} className="rounded-xl" dir="ltr" placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>انستغرام</Label>
            <Input name="social_instagram" defaultValue={initial.social_instagram} className="rounded-xl" dir="ltr" placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><svg className="h-4 w-4 text-sky-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>تويتر / X</Label>
            <Input name="social_twitter" defaultValue={initial.social_twitter} className="rounded-xl" dir="ltr" placeholder="https://twitter.com/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>يوتيوب</Label>
            <Input name="social_youtube" defaultValue={initial.social_youtube} className="rounded-xl" dir="ltr" placeholder="https://youtube.com/@..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#FF0050]"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.36 3.56 3.14 1.12-.13 2.07-.88 2.61-1.84.28-.5.43-1.06.42-1.62.03-2.32.01-4.63.02-6.95 0-.08.01-.17.02-.25h.01Z"/></svg>تيك توك</Label>
            <Input name="social_tiktok" defaultValue={initial.social_tiktok} className="rounded-xl" dir="ltr" placeholder="https://tiktok.com/@..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#FFFC00]"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5.83 4.53c-.6.09-1.17.37-1.59.76-.45.41-.73.91-.83 1.5-.08.47-.08.59-.03 1.37.06.85.14 1.22.47 2.03.66 1.6 1.85 2.84 3.4 3.52.7.31 1.26.46 2.06.55.54.06.58.06.69.01.12-.05.22-.16.28-.3.07-.18.08-.2.08-.56 0-.43-.03-.54-.23-.85-.27-.41-.39-.75-.44-1.19-.03-.3-.01-.41.09-.56.16-.25.44-.33.8-.22.2.06.29.13.52.44.26.35.36.44.61.55.41.19.72.19 1.13 0 .27-.12.42-.25.64-.55.23-.31.32-.38.52-.44.36-.11.64-.03.8.22.1.15.12.26.09.56-.05.44-.17.78-.44 1.19-.2.31-.23.42-.23.85 0 .36.01.38.08.56.06.14.16.25.28.3.11.05.15.05.69-.01.8-.09 1.36-.24 2.06-.55 1.55-.68 2.74-1.92 3.4-3.52.33-.81.41-1.18.47-2.03.05-.78.05-.9-.03-1.37-.1-.59-.38-1.09-.83-1.5-.42-.39-.99-.67-1.59-.76-.48-.07-1.59-.09-5.16-.09s-4.68.02-5.16.09zM2.02 7.7c0 .3.24.54.54.54s.54-.24.54-.54-.24-.54-.54-.54-.54.24-.54.54zm18.88 0c0 .3.24.54.54.54s.54-.24.54-.54-.24-.54-.54-.54-.54.24-.54.54zM12 20.39c1.46 0 2.7-.31 3.94-.97l.37-.2v-.82c0-.79-.1-1.13-.38-1.32-.39-.27-.97-.29-1.55-.04-.82.35-1.56.49-2.38.49s-1.56-.14-2.38-.49c-.58-.25-1.16-.23-1.55.04-.28.19-.38.53-.38 1.32v.82l.37.2c1.24.66 2.48.97 3.94.97z"/></svg>سنت شات</Label>
            <Input name="social_snapchat" defaultValue={initial.social_snapchat} className="rounded-xl" dir="ltr" placeholder="https://snapchat.com/add/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#0088cc]"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.24-1.861-.44-.752-.24-1.35-.37-1.297-.78.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>تيليجرام</Label>
            <Input name="social_telegram" defaultValue={initial.social_telegram} className="rounded-xl" dir="ltr" placeholder="https://t.me/..." />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-blue-700"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>لينكد إن</Label>
            <Input name="social_linkedin" defaultValue={initial.social_linkedin} className="rounded-xl" dir="ltr" placeholder="https://linkedin.com/company/..." />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl">{error}</p>}
      {msg && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-xl">{msg}</p>}
      <Button type="submit" size="lg" className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md w-full md:w-auto">
        <Save className="h-5 w-5" /> حفظ جميع الإعدادات
      </Button>
    </form>
  );
}
