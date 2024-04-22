import express from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import "./supertokens";
import multer from "multer";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import {
  createPortalSession,
  createSubsctiption,
  stripeWebhook,
} from "./controllers/stripe";
import {
  allClients,
  createClient,
  deleteClient,
  getClient,
  getPrintClient,
  getPrintClientPdf,
  updateClient,
  updateScenario,
} from "./controllers/client";
import {
  getLogo,
  getReport,
  getUser,
  updateUser,
  uploadLogo,
} from "./controllers/user";
const port = 3000;

let app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(middleware());

const upload = multer({});

app.get("/clients", verifySession(), allClients);
app.get("/client/:id", verifySession(), getClient);
app.get("/print/client/pdf/:id/:scenario", verifySession(), getPrintClientPdf);
app.get("/print/client/:id/", getPrintClient);
app.post("/client/:id", verifySession(), updateClient);
app.post("/client/scenarios/:id", verifySession(), updateScenario);
app.delete("/client/:id", verifySession(), deleteClient);
app.post("/clients", verifySession(), createClient);
app.post("/settings", verifySession(), updateUser);
app.get("/user", verifySession(), getUser);
app.get("/stripeRedirect", verifySession(), createPortalSession);
app.get("/stripeSubscribe", verifySession(), createSubsctiption);
app.post("/stripe/webhook", stripeWebhook);
app.post("/user/logo", verifySession(), upload.single("logo"), uploadLogo);
app.get("/logo/", getLogo);
app.get("/report/", verifySession(), getReport);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
