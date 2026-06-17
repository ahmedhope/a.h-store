"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DeleteButtonProps {
  action: (id: string) => Promise<{ success: boolean; error?: string }>;
  id: string;
  label?: string;
  size?: "icon" | "sm";
  className?: string;
}

export function DeleteButton({ action, id, label, size = "icon", className }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await action(id);
    setLoading(false);
    setOpen(false);
    if (result.success) {
      toast.success("تم الحذف بنجاح");
      router.refresh();
    } else {
      toast.error(result.error || "فشل الحذف");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size={size} className={className || "h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"}>
            {size === "sm" ? (label || "حذف") : <Trash2 className="h-3.5 w-3.5" />}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد الحذف</DialogTitle>
          <DialogDescription>هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>إلغاء</DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
