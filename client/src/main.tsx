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
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import Signup from "./pages/signup";
import Settings from "./pages/settings";
import Print from "./pages/print";
import VerifyEmail from "./pages/verify-email";
import VerifyEmailConfirm from "./pages/verify-email-confim";
import Home from "./pages/home";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/calculator",
        element: <Calculator />,
      },

      {
        path: "/clients",
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
  {
    path: "/login/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/auth/verify-email",
    element: <VerifyEmailConfirm />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SuperTokensWrapper>
      <RouterProvider router={router} />
    </SuperTokensWrapper>
  </React.StrictMode>,
);
