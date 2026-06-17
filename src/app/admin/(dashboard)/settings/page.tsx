import { requireAdmin } from "@/lib/auth";
import { SiteEditor } from "@/components/admin/site-editor";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAllSettings } from "@/actions/settings";
import { ArrowRight, Palette } from "lucide-react";
import Link from "next/link";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getAllSettings();

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Palette className="h-6 w-6 text-primary" />الإعدادات</h1>
          <p className="text-sm text-muted-foreground">تحكم في محتوى المتجر بالكامل</p>
        </div>
      </div>

      <SettingsForm />
      <div className="border-t border-border/50 pt-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />تخصيص واجهة المتجر
        </h2>
        <SiteEditor settings={settings} />
      </div>
    </div>
  );
}
