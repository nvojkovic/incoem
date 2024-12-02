import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import fs from "fs";
import crypto from "crypto";
import supertokens from "supertokens-node";

const prisma = new PrismaClient();

export const updateUser = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  const user = await prisma.userInfo.update({
    data: req.body,
    where: { id: userId },
  });
  return res.json(user);
};

export const toggleClientFeature = async (req: any, res: Response) => {
  let userId = req.session!.getUserId();
  const { name, value } = req.body;
  if (name === "inflation") {
    // update inflation field on liveSettings for every client
    const clients = await prisma.client.findMany({
      where: { userId },
    });
    clients.forEach(async (client) => {
      const old = client.liveSettings as any;
      await prisma.client.update({
        where: { id: client.id },
        data: {
          liveSettings: { ...old, inflation: value },
        },
      });
    });
  } else {
    const clients = await prisma.client.updateMany({
      where: { userId },
      data: {
        [name]: value,
      },
    });
  }
  return res.json({});
};

export const getUser = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();

  const secretKey = process.env.INTERCOM_SECRET as any;
  const userIdentifier = userId.toString(); // IMPORTANT: a UUID to identify your user

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(userIdentifier)
    .digest("hex");

  let userInfo = await supertokens.getUser(userId);
  const info = await prisma.userInfo.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, primaryColor: "#FF7957" },
  });
  res.json({
    userId,
    info: { ...info, email: userInfo?.emails[0] },
    createdAt: userInfo?.timeJoined,
    intercomHash: hash,
  });
};

export const uploadLogo = async (req: any, res: Response) => {
  let userId = req.session!.getUserId();
  //random name
  const name = Math.random().toString(36).substring(7);
  if (req.file) {
    fs.writeFileSync(`/storage/${name}.png`, req.file.buffer);
    await prisma.userInfo.update({
      data: { logo: `/storage/${name}.png` },
      where: { id: userId },
    });
  }
  return res.json({});
};

export const getLogo = async (req: any, res: Response) => {
  let { logo } = req.query;
  let file = fs.readFileSync(logo);
  if (file) {
    res.setHeader("Content-Type", "image/png");
    return res.send(file);
  }
  return res.status(404).send("Not found");
};

export const getReport = async (req: any, res: Response) => {
  let { report } = req.query;

  let file = fs.readFileSync(report);
  if (file) {
    res.setHeader("Content-Type", "application/pdf");
    return res.send(file);
  }
  return res.status(404).send("Not found");
};
