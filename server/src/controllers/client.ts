import { PrismaClient } from "@prisma/client";
import { Response } from "express";
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

export const updateClient = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  let { data } = req.body;
  let id = parseInt(req.params.id);
  const client = await prisma.client.update({
    where: {
      userId,
      id,
    },
    data: {
      data,
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
  const { data, title } = req.body;

  const result = await prisma.client.create({ data: { data, title, userId } });
  return res.json({ data: result });
};
