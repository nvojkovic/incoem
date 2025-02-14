import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import { request } from "http";

const prisma = new PrismaClient();
export const allClients = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  const clients = await prisma.client.findMany({
    where: {
      userId,
    },
    orderBy: {
      title: "asc",
    },
  });
  res.json(clients);
};

export const getClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let id = parseInt(req.params.id);
  try {
    const client = await prisma.client.findFirst({
      where: {
        userId,
        id,
      },
    });
    return res.json(client);
  } catch (e) {
    console.log(e);
    return res.json(null);
  }
};

export const getPrintClient = async (req: Request, res: Response) => {
  let id = parseInt(req.params.id);
  const client = await prisma.client.findFirst({
    where: {
      id,
    },
  });
  const userdata = await prisma.userInfo.findFirst({
    where: {
      id: client?.userId,
    },
  });
  res.json({ ...client, userdata });
};

const makeReport = async (id: number, page: string, fileName: string) => {
  const client = await prisma.client.findFirst({ where: { id } });
  let pages = client?.reportSettings as any;
  pages = pages.filter((p: any) => {
    if (!client?.longevityFlag && p.name === "longevity") return false;
    if (!client?.needsFlag && p.name === "spending") return false;
    if (!client?.needsFlag && p.name === "spending-chart") return false;
    return true;
  });

  const url =
    process.env.PRINTER_URL +
    "/?pages=" +
    JSON.stringify(pages) +
    "&url=" +
    process.env.APP_URL +
    // "http://im-client:5173" +
    page;
  console.log("Printing url:", url);
  const pdf = await fetch(url);
  const data = await pdf.arrayBuffer();
  fs.writeFileSync(fileName, Buffer.from(data));
};

export const getPrintAssetSummary = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const url =
    process.env.PRINTER_URL +
    "/asset-summary?url=" +
    // process.env.APP_URL +
    "http:im-client:5173" +
    "/print-asset-summary/" +
    req.params.id;

  const pdf = await fetch(url);
  const data = await pdf.arrayBuffer();
  const filename = `/storage/${id}-asset-summary.pdf`;
  fs.writeFileSync(filename, Buffer.from(data));
  return res.json({ file: filename });

  fetch(url).then(({ body, headers }) => {
    body?.pipeTo(
      new WritableStream({
        start() {
          headers.forEach((v, n) => res.setHeader(n, v));
        },
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      }),
    );
  });

  console.log(url);
};

export const getPrintClientPdfLive = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const page = "/print-live/" + req.params.id;
  const file = `/storage/${id}-live.pdf`;
  await makeReport(id, page, file);
  return res.json({ file });
};

export const getPrintClientPdf = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const page = "/print/" + req.params.id + "/" + req.params.scenario;
  const file = `/storage/${req.params.id}-${req.params.scenario}.pdf`;
  await makeReport(id, page, file);
  return res.json({ file });
};

export const duplicateClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let { name } = req.body;
  let id = parseInt(req.params.id);
  const client: any = await prisma.client.findUnique({
    where: {
      userId,
      id,
    },
  });
  if (!client) return null;
  client.title = name;
  delete client.id;
  await prisma.client.create({
    data: {
      ...client,
    },
  });
  res.json(client);
};

export const updateClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let {
    data,
    title,
    incomes,
    people,
    spending,
    stabilityRatioFlag,
    needsFlag,
    versatileCalculator,
    allInOneCalculator,
    taxesFlag,
    assetSummary,
    liveSettings,
    reportSettings,
    longevityFlag,
  } = req.body;
  let id = parseInt(req.params.id);
  const client = await prisma.client.update({
    where: {
      userId,
      id,
    },
    data: {
      data,
      title,
      incomes,
      people,
      spending,
      needsFlag,
      stabilityRatioFlag,
      longevityFlag,
      taxesFlag,
      assetSummary,
      allInOneCalculator,
      versatileCalculator,
      liveSettings,
      reportSettings,
      updatedAt: new Date(),
    },
  });
  res.json(client);
};

export const updateScenario = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let { data } = req.body;
  let id = parseInt(req.params.id);
  const client = await prisma.client.update({
    where: {
      userId,
      id,
    },
    data: {
      scenarios: data,
    },
  });
  res.json(client);
};

export const deleteClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let id = parseInt(req.params.id);
  await prisma.client.delete({
    where: {
      userId,
      id,
    },
  });
  res.json({});
};

export const createClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  const data = req.body;

  const result = await prisma.client.create({
    data: { ...data, userId },
  });
  return res.json({ data: result });
};
