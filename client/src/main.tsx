import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Calculator from "./Calculator";
import Clients from "./Clients";
import "./supertokens";
import Login from "./pages/login";
import Root from "./components/Root";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Signup from "./pages/signup";
import Settings from "./pages/settings";
import Print from "./pages/print";

SuperTokens.init({
  appInfo: {
    apiDomain: "https://my-express-api.onrender.com/",
    apiBasePath: "/auth",
    appName: "Income Mapper",
    websiteDomain: import.meta.env.PROD
      ? "https://income-mapper-frontend.onrender.com"
      : "http://localhost:5173",
    websiteBasePath: "/login",
  },
  recipeList: [Session.init(), ThirdPartyEmailPassword.init()],
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/calculator",
        element: <Calculator />,
      },

      {
        path: "/",
        element: <Clients />,
      },

      {
        path: "/client/:id",
        element: <Calculator />,
      },
      {
        path: "/profile",
        element: <Settings />,
      },
      {
        path: "/print/:id/:scenarioId",
        element: <Print />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SuperTokensWrapper>
      <RouterProvider router={router} />
    </SuperTokensWrapper>
  </React.StrictMode>,
);
