"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudinaryUpload } from "@/components/admin/cloudinary-upload";
import { createProduct, updateProduct } from "@/actions/products";
import { parseImages } from "@/lib/utils";
import { Plus, X, Video } from "lucide-react";
import type { Category, Product } from "@prisma/client";

interface Props {
  categories: Category[];
  product?: Product;
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [images, setImages] = useState<string[]>(product ? parseImages(product.images) : []);
  const [sizes, setSizes] = useState<string[]>(product ? JSON.parse(product.sizes || "[]") : []);
  const [colors, setColors] = useState<string[]>(product ? JSON.parse(product.colors || "[]") : []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  async function handleSubmit(formData: FormData) {
    formData.set("categoryId", categoryId);
    formData.set("images", JSON.stringify(images));
    formData.set("sizes", JSON.stringify(sizes));
    formData.set("colors", JSON.stringify(colors));
    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
    router.push("/admin/products");
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">السعر (ج.م)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compareAt">السعر قبل الخصم</Label>
          <Input id="compareAt" name="compareAt" type="number" step="0.01" defaultValue={product?.compareAt ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">المخزون</Label>
          <Input id="stock" name="stock" type="number" defaultValue={product?.stock ?? 0} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">الفئة</Label>
          <Select value={categoryId} onValueChange={(v: string | null) => v !== null && setCategoryId(v)}>
            <SelectTrigger><SelectValue placeholder="اختر فئة" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون فئة</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>المقاسات المتاحة</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {sizes.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-sm">
              {s}
              <button type="button" onClick={() => setSizes(sizes.filter((_, j) => j !== i))} className="text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Select value="" onValueChange={(v: string | null) => { if (v && !sizes.includes(v)) { setSizes([...sizes, v]); setNewSize(""); } }}>
            <SelectTrigger className="w-32"><SelectValue placeholder="مقاس" /></SelectTrigger>
            <SelectContent>
              {defaultSizes.filter((s) => !sizes.includes(s)).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="مقاس مخصص" className="w-24" />
            <Button type="button" variant="outline" size="icon" onClick={() => { if (newSize && !sizes.includes(newSize)) { setSizes([...sizes, newSize]); setNewSize(""); } }}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>الألوان المتاحة</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {colors.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-md border text-sm">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />
              {c}
              <button type="button" onClick={() => setColors(colors.filter((_, j) => j !== i))} className="text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="اسم اللون" className="w-32" />
          <Input type="color" className="w-10 h-10 p-1" onChange={(e) => { const name = newColor || e.target.value; if (name && !colors.includes(name)) { setColors([...colors, name]); setNewColor(""); }}} />
          <Button type="button" variant="outline" size="icon" onClick={() => { if (newColor && !colors.includes(newColor)) { setColors([...colors, newColor]); setNewColor(""); }}}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>صور المنتج</Label>
        <CloudinaryUpload images={images} onImagesChange={setImages} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video">
          <Video className="inline h-4 w-4 ml-1" />
          رابط فيديو المنتج (YouTube/Vimeo)
        </Label>
        <Input id="video" name="video" defaultValue={product?.video || ""} placeholder="https://www.youtube.com/watch?v=..." dir="ltr" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured ?? false} className="rounded border-gray-300" />
        <Label htmlFor="isFeatured">منتج مميز (يظهر في قسم المميزات)</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" className="rounded-xl bg-gradient-to-l from-primary to-chart-4 shadow-md">{product ? "حفظ التعديلات" : "إضافة المنتج"}</Button>
        <Button type="button" variant="outline" size="lg" className="rounded-xl border-border/50" onClick={() => router.push("/admin/products")}>إلغاء</Button>
      </div>
    </form>
  );
}
