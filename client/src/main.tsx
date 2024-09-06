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
import PrintPage from "./pages/print";
import VerifyEmail from "./pages/verify-email";
import VerifyEmailConfirm from "./pages/verify-email-confim";
import Subscribe from "./pages/subscribe";
import PrintLivePage from "./pages/print-live";
import Paused from "./pages/paused";
import HelpCenter from "./pages/help";
import ResetPassword from "./pages/reset-password";
import ResetPasswordConfirm from "./pages/reset-password-confirm";
import VersatileCalculator from "./components/Calculators/VersatileCalculator";

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
      { path: "/", element: <Clients /> },
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
        path: "/client/:id/calculator/versatile",
        element: <VersatileCalculator />,
      },
      {
        path: "/profile",
        element: <Settings />,
      },
      {
        path: "/subscribe",
        element: <Subscribe />,
      },
      {
        path: "/paused",
        element: <Paused />,
      },
      {
        path: "/help",
        element: <HelpCenter />,
      },
    ],
  },
  {
    path: "/print-live/:id/",
    element: <PrintLivePage />,
  },
  {
    path: "/print/:id/:scenarioId",
    element: <PrintPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPasswordConfirm />,
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
