import { Navbar } from "@/components/store/navbar";
import { Footer } from "@/components/store/footer";
import { AnnouncementBanner } from "@/components/store/announcement-banner";
import { getCategories } from "@/actions/products";
import { getAllSettings } from "@/actions/settings";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getAllSettings(),
  ]);

  return (
    <>
      <AnnouncementBanner settings={settings} />
      <Navbar categories={categories} settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
