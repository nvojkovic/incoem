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
  if (!url) {
    return res.status(400).send("Missing url query parameter");
  }
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log("url", url);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url as any, {
    waitUntil: ["networkidle0", "load", "domcontentloaded"],
  });

  //wait a second
  console.log("waiting");
  await new Promise((r) => setTimeout(r, 1000));
  console.log("done waiting");

  const header = await page.evaluate(() => {
    const headerElement = document.getElementById("print-header");
    if (!headerElement) return "";
    return headerElement.innerHTML;
  });
  console.log("header", header);
  const pdf = await page.pdf({
    format: "letter",
    landscape: true,
    printBackground: true,
    headerTemplate: header,
    displayHeaderFooter: true,
    margin: {
      bottom: "30px",
      top: "60px",
    },
  });

  await page.addStyleTag({
    content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}",
  });
  await browser.close();
  res.contentType("application/pdf");
  res.send(pdf);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
