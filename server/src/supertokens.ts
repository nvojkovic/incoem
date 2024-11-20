import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/emailpassword";
import EmailVerification from "supertokens-node/recipe/emailverification";
import Dashboard from "supertokens-node/recipe/dashboard";
import { SMTPService } from "supertokens-node/recipe/emailpassword/emaildelivery";
import { SMTPService as EmailVerificationSMTPService } from "supertokens-node/recipe/emailverification/emaildelivery";

const smtpSettings = {
  host: "smtp-relay.brevo.com",
  authUsername: "info@incomemapper.com",
  password: "ErM5a6wZW4jvYhUF",
  port: 587,
  from: { name: "Income Mapper", email: "noreply@incomemapper.com" },
};

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
      emailDelivery: {
        service: new SMTPService({ smtpSettings }),
      },
    }),
    EmailVerification.init({
      mode: "REQUIRED",
      emailDelivery: {
        service: new EmailVerificationSMTPService({ smtpSettings }),
      },
    }),
    Session.init(), // initializes session features
  ],
});
