import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function fixMojibake(text: string): string {
  try {
    // Decode as Latin-1 (each char code → byte), then re-encode as UTF-8
    const buf = Buffer.from(text, "latin1");
    const fixed = buf.toString("utf-8");
    const hasArabic = /[\u0600-\u06FF]/.test(fixed);
    if (hasArabic && fixed !== text) return fixed;
    return text;
  } catch { return text; }
}

async function main() {
  const orderItems = await prisma.orderItem.findMany();
  let fixed = 0;
  for (const item of orderItems) {
    const fixedName = fixMojibake(item.name);
    if (fixedName !== item.name) {
      await prisma.orderItem.update({ where: { id: item.id }, data: { name: fixedName } });
      console.log(`FIXED: ${item.name} → ${fixedName}`);
      fixed++;
    }
  }
  console.log(`\nFixed ${fixed} of ${orderItems.length} order items.`);

  // Also check that original product names are correct
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  for (const p of products) {
    const fixedName = fixMojibake(p.name);
    if (fixedName !== p.name) {
      await prisma.product.update({ where: { id: p.id }, data: { name: fixedName } });
      console.log(`FIXED product: ${p.name} → ${fixedName}`);
    }
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); });
