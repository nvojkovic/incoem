import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import puppeteer, { Browser, Page } from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { Cluster } from "puppeteer-cluster";
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
async function mergeAllPDFs(urls: string[]) {
  // create an empty PDFLib object of PDFDocument to do the merging into
  const pdfDoc = await PDFDocument.create();

  // iterate over all documents to merge
  const numDocs = urls.length;
  for (var i = 0; i < numDocs; i++) {
    // download the document
    const donorPdfBytes = urls[i];

    // load/convert the document into a PDFDocument object
    const donorPdfDoc = await PDFDocument.load(donorPdfBytes);

    // iterate over the document's pages
    const docLength = donorPdfDoc.getPageCount();
    for (var k = 0; k < docLength; k++) {
      // extract the page to copy
      const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);

      // add the page to the overall merged document
      pdfDoc.addPage(donorPage);
    }
  }

  // save as a Base64 URI
  const pdfData = await pdfDoc.save();
  return Buffer.from(pdfData);
}

const getAssetSummary = async (browser: Browser, url: string) => {
  try {
    const page = await browser.newPage();
    console.log("new page");
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
    });

    //wait a second
    console.log("waiting");
    await new Promise((r) => setTimeout(r, 2000));
    console.log("done waiting");

    const header = await page.evaluate(() => {
      const headerElement = document.getElementById("print-header");
      if (!headerElement) return "";
      return headerElement.innerHTML;
    });
    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      headerTemplate: header,
      displayHeaderFooter: !!header,
      scale: 0.55,
      margin: {
        top: "30px",
        bottom: "30px",
      },
    });
    //
    // await page.addStyleTag({
    //   content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}",
    // });
    return pdf;
  } catch (e) {
    console.log(e);
  }
};
const getVersatile = async (browser: Browser, url: string) => {
  try {
    const page = await browser.newPage();
    console.log("new page");
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
    });

    //wait a second
    console.log("waiting");
    await new Promise((r) => setTimeout(r, 2000));
    console.log("done waiting");

    const header = await page.evaluate(() => {
      const headerElement = document.getElementById("print-header");
      if (!headerElement) return "";
      return headerElement.innerHTML;
    });
    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      headerTemplate: header,
      displayHeaderFooter: !!header,
      scale: 0.85,
      margin: {
        top: "30px",
        bottom: "30px",
      },
    });
    //
    // await page.addStyleTag({
    //   content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}",
    // });
    return pdf;
  } catch (e) {
    console.log(e);
  }
};

const getPdf = async (page: Page, base: string, data: any) => {
  try {
    const url = `${base}?page=${JSON.stringify(data)}`;
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, {
      waitUntil: ["networkidle0", "load", "domcontentloaded"],
    });

    //wait a second
    // console.log("waiting");
    // await new Promise((r) => setTimeout(r, 2000));
    // console.log("done waiting");

    const header = await page.evaluate(() => {
      const headerElement = document.getElementById("print-header");
      if (!headerElement) return "";
      return headerElement.innerHTML;
    });
    const pdf = await page.pdf({
      format: "letter",
      landscape: true,
      printBackground: true,
      headerTemplate: header,
      displayHeaderFooter: !!header,
      margin: {
        bottom: "30px",
        top: "60px",
      },
    });
    //
    // await page.addStyleTag({
    //   content: "@page:first {margin-top: 0;} body {margin-top: 1cm;}",
    // });
    console.log("got pdf", data.name);
    return pdf;
  } catch (e) {
    console.log(e);
  }
};

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 20,
    puppeteerOptions: {
      executablePath: "/usr/bin/google-chrome",
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    },
  });

  await cluster.task(async ({ page, data }) => {
    const pdf = await getPdf(page, data.url, data.data);
    return pdf;
  });

  app.get("/", async (req, res) => {
    const { url, pages } = req.query;
    if (!url) {
      return res.status(400).send("Missing url query parameter");
    }
    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      ignoreDefaultArgs: ["--disable-extensions"],
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const toPrint = JSON.parse(pages as string).filter((i: any) => i.enabled);

    // log timing performance
    const start = Date.now();
    const printedPages = await Promise.all(
      toPrint.map((page: any) => cluster.execute({ url, data: page })),
    );
    console.log("merging PDFs", Date.now() - start);
    const result = await mergeAllPDFs(printedPages);
    console.log("done", Date.now() - start);
    browser.close();

    res.contentType("application/pdf");
    res.send(result);
  });
})();

app.get("/asset-summary", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("Missing url query parameter");
  }
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const result = await getAssetSummary(browser, url as string);
  browser.close();

  res.contentType("application/pdf");
  console.log(result);
  if (result) res.send(Buffer.from(result));
});

app.get("/versatile", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("Missing url query parameter");
  }
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--user-agent=printer"],
  });

  const result = await getVersatile(browser, url as string);
  browser.close();

  res.contentType("application/pdf");
  console.log(result);
  if (result) res.send(Buffer.from(result));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${port}`);
});
