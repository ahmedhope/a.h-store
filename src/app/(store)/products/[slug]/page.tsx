import type { Metadata } from "next";
import { getProduct } from "@/actions/products";
import { ProductDetail } from "@/components/store/product-detail";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "المنتج غير موجود" };
  return {
    title: `${product.name} — a&h`,
    description: product.description || `اشتري ${product.name} من متجر a&h بأفضل الأسعار`,
    openGraph: { title: product.name, description: product.description || undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return (
    <div className="container-store py-6 md:py-10">
      <ProductDetail product={product} />
    </div>
  );
}
