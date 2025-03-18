const prismaLib = require("@prisma/client");
const PrismaClient = prismaLib.PrismaClient;

const prisma = new PrismaClient();
const newPages = [
  {
    id: "cc2e7cfd-c573-4cac-8d3d-c2dd1970dafa",
    name: "by-tax-status",
    settings: {},
    enabled: false,
  },
  {
    id: "bb53a28d-cf01-4027-98b1-e126504bd9fc",
    name: "by-income-type",
    settings: {},
    enabled: false,
  },
  {
    id: "26735c32-473b-4391-82e0-a75acc5acc33",
    name: "by-person",
    settings: {},
    enabled: false,
  },
];
async function main() {
  await prisma.$transaction(async (tx) => {
    const clients = await tx.client.findMany();
    for (const client of clients) {
      await tx.client.update({
        where: { id: client.id },
        data: {
          reportSettings: [...client.reportSettings, ...newPages],
        },
      });
    }
    const users = await tx.userInfo.findMany();
    for (const user of users) {
      await tx.userInfo.update({
        where: { id: user.id },
        data: {
          globalReportSettings: [...user.globalReportSettings, ...newPages],
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
