import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowRight } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions/categories";
import { DeleteButton } from "@/components/admin/delete-button";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { products: true } } } });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">الفئات</h1>
      </div>

      <form action={createCategory} className="flex gap-2">
        <Input name="name" placeholder="اسم الفئة الجديدة" required className="max-w-xs rounded-xl" />
        <Button type="submit" className="rounded-xl gap-2 bg-gradient-to-l from-primary to-chart-4 shadow-md"><Plus className="h-4 w-4" />إضافة</Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="border-b border-border/50">
              <th className="text-right p-3 font-medium">الاسم</th>
              <th className="text-right p-3 font-medium">عدد المنتجات</th>
              <th className="text-left p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3">{cat._count.products}</td>
                  <td className="p-3 text-left">
                  <DeleteButton action={deleteCategory} id={cat.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
