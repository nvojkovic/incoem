const prismaLib = require("@prisma/client");
const PrismaClient = prismaLib.PrismaClient;

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany();
    for (const client of clients) {
      const newCalc = {
        user: {
          startAge: client.versatileCalculator.user?.startAge,
          endValue: client.versatileCalculator.user?.endValue || 0,
          presentValue: client.versatileCalculator.user?.presentValue || 0,
          endYear: client.versatileCalculator.user?.endYear,
        },
        payment: {
          amount: client.versatileCalculator.payment?.amount || 0,
          timing: client.versatileCalculator.payment?.timing || "beginning",
          increase: client.versatileCalculator.payment?.increase || 0,
          startYear: client.versatileCalculator.payment?.startYear,
          detailedIncrease:
            client.versatileCalculator.payment?.detailedIncrease || 0,
          years: client.versatileCalculator.payment?.years || {},
          type: client.versatileCalculator.payment?.type || "simple",
        },
        other: {
          taxRate: client.versatileCalculator.other?.taxRate || 0,
          inflation: client.versatileCalculator.other?.inflation || 0,
          investmentFee: client.versatileCalculator.other?.investmentFee || 0,
        },
        solve: {
          field: client.versatileCalculator?.solve?.field || "presentValue",
        },
        returns: {
          rateOfReturn: client.versatileCalculator.other?.rateOfReturn || 0,
          returnType: client.versatileCalculator.other?.returnType || "simple",
          yearlyReturns: client.versatileCalculator.other?.yearlyReturns || {},
          mean: client.versatileCalculator.other?.mean || 0,
          std: client.versatileCalculator.other?.std || 0,
          selectedRandom: "mean",
          seed: 1,
        },
      };
      await tx.client.update({
        where: { id: client.id },
        data: {
          versatileCalculator: newCalc,
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
