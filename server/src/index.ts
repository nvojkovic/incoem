import express from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import "./supertokens";
import multer from "multer";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { createPortalSession, stripeWebhook } from "./controllers/stripe";
import {
  allClients,
  createClient,
  deleteClient,
  duplicateClient,
  getClient,
  getPrintClient,
  getPrintClientPdf,
  getPrintClientPdfLive,
  updateClient,
  updateScenario,
} from "./controllers/client";
import {
  getLogo,
  getReport,
  getUser,
  impersonateUser,
  toggleClientFeature,
  updateUser,
  uploadLogo,
} from "./controllers/user";
import {
  externalMiddleware,
  getAssetSummary,
  listClients,
  updateAssetSummary,
  validateRequest,
} from "./controllers/external";
import { updateAssetSummarySchema } from "./schema/assetSummary";
const port = 3000;

let app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "content-type",
      ...supertokens.getAllCORSHeaders(),
      "baggage",
      "fdi-version",
      "rid",
      "sentry-trace",
      "st-auth-mode",
    ],
    methods: ["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    credentials: true,
  }),
);
app.use(middleware());

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

app.get("/clients", verifySession(), allClients);
app.get("/client/:id", verifySession(), getClient);
app.get("/print/client/pdf/:id/:scenario", verifySession(), getPrintClientPdf);
app.get("/print/client/pdf-live/:id/", verifySession(), getPrintClientPdfLive);
app.get("/print/client/:id/", getPrintClient);
app.post("/client/:id", verifySession(), updateClient);
app.post("/client/:id/duplicate", verifySession(), duplicateClient);
app.post("/client/scenarios/:id", verifySession(), updateScenario);
app.delete("/client/:id", verifySession(), deleteClient);
app.post("/clients", verifySession(), createClient);
app.post("/settings", verifySession(), updateUser);
app.get("/user", verifySession(), getUser);
app.get("/user/impersonate", verifySession(), impersonateUser);
app.get("/stripeRedirect", verifySession(), createPortalSession);
app.post("/user/featureToggle", verifySession(), toggleClientFeature);
app.post("/stripe/webhook", stripeWebhook);
app.post("/user/logo", verifySession(), upload.single("logo"), uploadLogo);
app.get("/logo/", getLogo);
app.get("/report/", verifySession(), getReport);
app.get("/help", async (req, res) => {
  const url =
    "https://docs.google.com/document/d/e/2PACX-1vTFKe6zajevHL1gSpflZDJ1aYSwbYSVUbgYRXVErnzRvf3z2-2XoVpISBAT2EHiTOHyGDOI99DI8gPB/pub?embedded=true";
  const data = await fetch(url);
  res.send(await data.text());
});

app.get("/external/advisor/:email", externalMiddleware, listClients);
app.get("/external/asset-summary/:id", externalMiddleware, getAssetSummary);
app.put(
  "/external/asset-summary/:id",
  externalMiddleware,
  validateRequest(updateAssetSummarySchema),
  updateAssetSummary,
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
