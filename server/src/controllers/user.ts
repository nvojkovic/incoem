import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { SessionRequest } from "supertokens-node/framework/express";
import fs from "fs";

const prisma = new PrismaClient();

export const updateUser = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  await prisma.userInfo.update({ data: req.body, where: { id: userId } });
  return res.json({});
};

export const getUser = async (req: SessionRequest, res: Response) => {
  let userId = req.session!.getUserId();
  const info = await prisma.userInfo.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
  res.json({ userId, info });
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
