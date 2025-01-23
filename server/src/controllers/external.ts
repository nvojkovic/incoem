import express, { RequestHandler } from "express";
import supertokens from "supertokens-node";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const validateRequest =
  (schema: z.ZodType) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid request data",
          details: error.errors,
        });
      }
      return next(error);
    }
  };

export const externalMiddleware: RequestHandler = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization !== process.env.PARTHEAN_API_KEY
  ) {
    return res.status(401).json({ message: "unauthorized" });
  }

  next();
};

export const listClients: RequestHandler = async (req, res) => {
  const email = req.params.email;
  let usersInfo = await supertokens.listUsersByAccountInfo("public", {
    email,
  });
  if (!usersInfo.length) {
    return res.status(404).json({ message: "user not found" });
  }
  let clients = await prisma.client.findMany({
    where: {
      userId: usersInfo[0].id,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      people: true,
      title: true,
    },
  });
  res.json(clients);
};

export const getAssetSummary: RequestHandler = async (req, res) => {
  const id = req.params.id;
  let client = await prisma.client.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      people: true,
      assetSummary: true,
    },
  });
  if (!client) {
    return res.status(404).json({ message: "client not found" });
  }
  res.json(client);
};

export const updateAssetSummary: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const { assetSummary } = req.body;
  const oldClient = await prisma.client.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  if (!oldClient) {
    return res.status(404).json({ message: "client not found" });
  }
  let client = await prisma.client.update({
    where: {
      id: parseInt(id),
    },
    data: {
      assetSummary: {
        ...JSON.parse(JSON.stringify(oldClient.assetSummary) || "{}"),
        ...assetSummary,
      },
    },
    select: {
      id: true,
      people: true,
      assetSummary: true,
    },
  });
  res.json(client);
};
