const prismaLib = require("@prisma/client");
const PrismaClient = prismaLib.PrismaClient;

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany();
    for (const client of clients) {
      await tx.client.update({
        where: { id: client.id },
        data: {
          incomes: client.incomes.map((item) => ({
            ...item,
            taxType: item.taxType || "Taxable",
          })),
        },
      });
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
