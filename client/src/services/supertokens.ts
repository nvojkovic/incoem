import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/emailpassword";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import config from "./config";
SuperTokens.init({
  appInfo: {
    apiDomain: config.API_URL,
    apiBasePath: "/auth",
    appName: "Income Mapper",
    websiteDomain: config.APP_URL,
    websiteBasePath: "/login",
  },
  recipeList: [
    Session.init(),
    ThirdPartyEmailPassword.init(),
    EmailVerification.init(),
  ],
});
