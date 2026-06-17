import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const items = await prisma.orderItem.findMany({ select: { id: true, name: true } });
  for (const item of items) {
    console.log(`ID: ${item.id}`);
    console.log(`name: "${item.name}"`);
    console.log(`codes: ${Array.from(item.name).map(c => c.charCodeAt(0).toString(16)).join(" ")}`);
    console.log(`has Arabic: ${/[\u0600-\u06FF]/.test(item.name)}`);
    
    const buf = Buffer.from(item.name, "latin1");
    const fixed = buf.toString("utf-8");
    console.log(`fixed: "${fixed}"`);
    console.log(`fixed codes: ${Array.from(fixed).map(c => c.charCodeAt(0).toString(16)).join(" ")}`);
    console.log(`fixed has Arabic: ${/[\u0600-\u06FF]/.test(fixed)}`);
    console.log(`different: ${fixed !== item.name}`);
    console.log("---");
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); prisma.$disconnect(); });
