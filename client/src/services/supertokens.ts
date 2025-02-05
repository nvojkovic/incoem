import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/emailpassword";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
SuperTokens.init({
  appInfo: {
    apiDomain: import.meta.env.VITE_API_URL,
    apiBasePath: "/auth",
    appName: "Income Mapper",
    websiteDomain: import.meta.env.VITE_APP_URL,
    websiteBasePath: "/login",
  },
  recipeList: [
    Session.init(),
    ThirdPartyEmailPassword.init(),
    EmailVerification.init(),
  ],
});
