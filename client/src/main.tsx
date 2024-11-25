import ReactDOM from "react-dom/client";
import "./index.css";
import "./sentry";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Clients from "./Clients";
import "./supertokens";
import Login from "./pages/login";
import Root from "./components/Root";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/emailpassword";
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
import ClientContainer from "./components/ClientContainer";
import IncomeSection from "./components/IncomeSection";
import Summary from "./components/Summary";
import CalculatorMap from "./components/Calculators/CalculatorMap";
import SpendingPage from "./components/Spending/SpendingPage";
import AllInOneCalculator from "./components/Calculators/AllInOnceCalculator";
import ClientOverview from "./components/ClientOverview";
import NotFound from "./pages/not-found";
import LongevityPage from "./components/Longevity/LongevityPage";

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

const A = () => {
  const a: any = undefined;
  return <div>{a[1]}</div>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Clients /> },
      {
        path: "/clients",
        element: <Clients />,
      },
      {
        path: "/test",
        element: <A />,
      },
      {
        path: "client",
        element: <ClientContainer />,
        children: [
          {
            path: ":id/*",
            children: [
              { path: "income", element: <IncomeSection defaultOpen={true} /> },
              {
                path: "calculator/versatile",
                element: <VersatileCalculator />,
              },
              {
                path: "calculator/time-value-of-money",
                element: <AllInOneCalculator />,
              },
              {
                path: "longevity",
                element: <LongevityPage />,
              },
              {
                path: "spending",
                element: <SpendingPage />,
              },
              {
                path: "map",
                element: <Summary />,
              },
              {
                path: "basic",
                element: <ClientOverview />,
              },
              {
                path: "calculator",
                element: <CalculatorMap />,
              },
            ],
          },
        ],
      },
      // {
      //   path: "/client/:id",
      //   element: <ClientContainer />,
      //   children: [
      //     { path: "income", element: <IncomeSection defaultOpen={true} /> },
      //     {
      //       path: "calculator/versatile",
      //       element: <VersatileCalculator />,
      //     },
      //     {
      //       path: "calculator/time-value-of-money",
      //       element: <AllInOneCalculator />,
      //     },
      //     {
      //       path: "longevity",
      //       element: <LongevityPage />,
      //     },
      //     {
      //       path: "spending",
      //       element: <SpendingPage />,
      //     },
      //     {
      //       path: "map",
      //       element: <Summary />,
      //     },
      //     {
      //       path: "basic",
      //       element: <ClientOverview />,
      //     },
      //     {
      //       path: "calculator",
      //       element: <CalculatorMap />,
      //     },
      //   ],
      // },
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

  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <SuperTokensWrapper>
    <RouterProvider router={router} />
  </SuperTokensWrapper>,
);
