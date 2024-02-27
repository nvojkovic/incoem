import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import Dashboard from "supertokens-node/recipe/dashboard";

supertokens.init({
  framework: "express",
  supertokens: {
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: "http://supertokens-core-u5jl:3567",
    // apiKey: <API_KEY(if configured)>,
  },
  appInfo: {
    // learn more about this on https://supertokens.com/docs/session/appinfo
    appName: "Income Mapper",
    apiDomain: "https://my-express-api.onrender.com/",
    websiteDomain: "https://income-mapper-frontend.onrender.com/",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Dashboard.init(),

    ThirdPartyEmailPassword.init({
      /*TODO: See next step*/
    }),
    Session.init(), // initializes session features
  ],
});
