const local =
  navigator.userAgent === "printer"
    ? "http://im-server:3000/"
    : "http://localhost:3000/";
const API_URL = import.meta.env.VITE_API_URL;
const PRINT_API_URL = import.meta.env.VITE_ENV === "local" ? local : API_URL;

export default {
  API_URL,
  PRINT_API_URL,
  APP_URL: import.meta.env.VITE_APP_URL,
  ENV: import.meta.env.VITE_ENV,
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  STRIPE_PRICING_TABLE_ID: import.meta.env.VITE_STRIPE_PRICING_TABLE_ID,
};
