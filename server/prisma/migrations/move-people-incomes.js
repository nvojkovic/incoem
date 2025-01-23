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
          data: {},
          incomes: client.data.incomes,
          people: client.data.people,
          scenarios: client.scenarios.map((scenario) => ({
            ...scenario,
            data: null,
            people: scenario.data.people,
            incomes: scenario.data.incomes,
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
