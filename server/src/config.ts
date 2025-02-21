const ENV = process.env.ENV;
const config = {
  ENV,
  PRINTER_URL: process.env.PRINTER_URL,
  APP_URL: process.env.APP_URL,
  PRINTER_APP_URL:
    ENV === "local" ? "http://im-client:5173" : process.env.APP_URL,
};

console.log(config);
export default config;
