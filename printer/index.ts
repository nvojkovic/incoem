import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
dotenv.config();
const port = 3002;

let app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.get("/", async (req, res) => {
  const { url } = req.query;
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url as any, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();
  res.contentType("application/pdf");
  res.send(pdf);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
