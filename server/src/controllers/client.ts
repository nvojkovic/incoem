import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { Request, Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";

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
  const client = await prisma.client.findFirst({
    where: {
      userId,
      id,
    },
  });
  res.json(client);
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

export const getPrintClientPdf = async (req: Request, res: Response) => {
  const url =
    process.env.PRINTER_URL +
    "/?url=" +
    process.env.APP_URL +
    // "http://im-client:5173" +
    "/print/" +
    req.params.id +
    "/" +
    req.params.scenario;

  console.log("Printing url:", url);
  const pdf = await fetch(url);
  const data = await pdf.arrayBuffer();
  const file = `/storage/${req.params.id}-${req.params.scenario}.pdf`;
  fs.writeFileSync(file, Buffer.from(data));
  return res.json({ file });
};

export const getPrintClientPdfLive = async (req: Request, res: Response) => {
  const url =
    process.env.PRINTER_URL +
    "/?url=" +
    process.env.APP_URL +
    // "http://im-client:5173" +
    "/print-live/" +
    req.params.id;
  console.log("Printing url:", url);
  const pdf = await fetch(url);
  const data = await pdf.arrayBuffer();
  const file = `/storage/${req.params.id}-live.pdf`;
  fs.writeFileSync(file, Buffer.from(data));
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
    spending,
    stabilityRatioFlag,
    needsFlag,
    versatileCalculator,
    allInOneCalculator,
    liveSettings,
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
      spending,
      needsFlag,
      stabilityRatioFlag,
      allInOneCalculator,
      versatileCalculator,
      liveSettings,
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
  const { data, title, needsFlag, stabilityRatioFlag } = req.body;

  const result = await prisma.client.create({
    data: { data, title, userId, needsFlag, stabilityRatioFlag },
  });
  return res.json({ data: result });
};
