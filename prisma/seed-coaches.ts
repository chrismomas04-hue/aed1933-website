import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.coach.count();
  if (count === 0) {
    await prisma.coach.createMany({
      data: [
        { firstName: "Θανάσης", lastName: "Παπαγεωργίου", role: "Προπονητής",                   age: 48, nationality: "Ελλάδα" },
        { firstName: "Μάκης",   lastName: "Σπανός",        role: "Βοηθός Προπονητή",             age: 42, nationality: "Ελλάδα" },
        { firstName: "Κώστας",  lastName: "Ρέππας",         role: "Προπονητής Τερματοφυλάκων",   age: 38, nationality: "Ελλάδα" },
      ],
    });
    console.log("✅ Coaches seeded");
  } else {
    console.log(`⏭  Coaches already exist (${count}), skipping`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
