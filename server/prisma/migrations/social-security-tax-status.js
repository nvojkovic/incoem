const prismaLib = require("@prisma/client");
const PrismaClient = prismaLib.PrismaClient;

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany();
    for (const client of clients) {
      const result = await tx.client.update({
        where: { id: client.id },
        data: {
          incomes: client.incomes.map((item) =>
            item.type === "social-security"
              ? { ...item, taxType: "Social Security" }
              : item,
          ),
          scenarios: client.scenarios.map((scenario) => ({
            ...scenario,
            incomes: scenario.incomes.map((item) =>
              item.type === "social-security"
                ? { ...item, taxType: "Social Security" }
                : item,
            ),
          })),
        },
      });
      console.log(result);
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
