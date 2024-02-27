import express from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import "./supertokens";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { createPortalSession } from "./stripe";
const port = 3000;

let app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://income-mapper-frontend.onrender.com",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  }),
);

// IMPORTANT: CORS should be before the below line.
app.use(middleware());

const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/clients", verifySession(), async (req: any, res) => {
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
});

app.get("/client/:id", verifySession(), async (req: any, res) => {
  let userId = req.session!.getUserId();
  let id = parseInt(req.params.id);
  const client = await prisma.client.findFirst({
    where: {
      userId,
      id,
    },
  });
  res.json(client);
});

app.post("/client/:id", verifySession(), async (req: any, res) => {
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
});

app.post("/client/scenarios/:id", verifySession(), async (req: any, res) => {
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
});

app.delete("/client/:id", verifySession(), async (req: any, res) => {
  let userId = req.session!.getUserId();
  let id = parseInt(req.params.id);
  await prisma.client.delete({
    where: {
      userId,
      id,
    },
  });
  res.json({});
});

app.post("/clients", verifySession(), async (req: any, res) => {
  let userId = req.session!.getUserId();
  const { data, title } = req.body;

  const result = await prisma.client.create({ data: { data, title, userId } });
  return res.json({ data: result });
});

app.post("/settings", verifySession(), async (req: any, res) => {
  let userId = req.session!.getUserId();
  await prisma.userInfo.update({ data: req.body, where: { id: userId } });
  return res.json({});
});

app.get("/user", verifySession(), async (req: any, res) => {
  let userId = req.session!.getUserId();
  const info = await prisma.userInfo.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });
  res.json({ userId, info });
});

app.get("/stripeRedirect", verifySession(), createPortalSession);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
