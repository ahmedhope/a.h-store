import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  for (const o of orders) {
    console.log(`\nOrder #${o.id.slice(-6).toUpperCase()}`);
    console.log(`  Customer: ${o.customerName}`);
    console.log(`  Phone: ${o.customerPhone}`);
    for (const item of o.items) {
      console.log(`  Item: ${item.name} x${item.quantity}`);
      console.log(`  name hex: ${Buffer.from(item.name, "utf8").toString("hex")}`);
    }
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); });
