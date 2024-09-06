import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/emailpassword";
import EmailVerification from "supertokens-node/recipe/emailverification";
import Dashboard from "supertokens-node/recipe/dashboard";

supertokens.init({
  framework: "express",
  supertokens: {
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: process.env.SUPERTOKENS_URL || "",
    // apiKey: <API_KEY(if configured)>,
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Income Mapper",
    apiDomain: process.env.API_URL || "http://localhost:3000",
    websiteDomain: process.env.APP_URL || "http://localhost:3000",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Dashboard.init(),

    ThirdPartyEmailPassword.init({
      /*TODO: See next step*/
    }),
    EmailVerification.init({
      mode: "REQUIRED",
    }),
    Session.init(), // initializes session features
  ],
});
