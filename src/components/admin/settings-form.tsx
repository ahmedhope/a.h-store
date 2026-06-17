"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword, updateStoreSettings } from "@/actions/admin";
import { Lock, Store, Smartphone } from "lucide-react";

export function SettingsForm() {
  const [passMsg, setPassMsg] = useState("");
  const [storeMsg, setStoreMsg] = useState("");

  async function handlePassword(form: FormData) {
    const res = await changePassword(form);
    setPassMsg(res?.error || "✅ تم تغيير كلمة المرور بنجاح");
  }

  async function handleStore(form: FormData) {
    const res = await updateStoreSettings(form);
    setStoreMsg(res?.error || "✅ تم حفظ الإعدادات");
  }

  return (
    <div className="max-w-2xl space-y-8">

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />تغيير كلمة المرور</CardTitle></CardHeader>
        <CardContent>
          <form action={handlePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>كلمة المرور الحالية</Label>
              <Input name="current" type="password" required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>كلمة المرور الجديدة</Label>
              <Input name="newPassword" type="password" required minLength={6} dir="ltr" />
            </div>
            <Button type="submit">تغيير كلمة المرور</Button>
            {passMsg && <p className="text-sm text-green-600">{passMsg}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" />إعدادات المتجر</CardTitle></CardHeader>
        <CardContent>
          <form action={handleStore} className="space-y-4">
            <div className="space-y-2">
              <Label>اسم المتجر</Label>
              <Input name="storeName" defaultValue={process.env.NEXT_PUBLIC_STORE_NAME || "a&h"} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Smartphone className="h-4 w-4" />رقم واتساب</Label>
              <Input name="whatsapp" defaultValue={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966500000000"} dir="ltr" />
            </div>
            <Button type="submit">حفظ الإعدادات</Button>
            {storeMsg && <p className="text-sm text-green-600">{storeMsg}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
