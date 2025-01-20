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
import { IncomeProvider } from "./useData";
import { useState } from "react";
import IncomeCash from "./components/Nate/IncomeCash";
import { Client } from "./types";
import HardAssets from "./components/Nate/HardAssets";
import DebtInheritance from "./components/Nate/DebtInheritance";
import SocialInsurancePage from "./components/Nate/SocialInsurance";
import StatementWealthPage from "./components/Nate/StatementWealth";
import Analysis from "./components/Nate/Analysis";
import ContractualWealthPage from "./components/Nate/ContractualWealth";

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
        path: "client/:id",
        element: <ClientContainer />,
        children: [
          { path: "income", element: <IncomeSection /> },
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
            path: "nate",
            children: [
              {
                path: "income-cash",
                element: <IncomeCash />,
              },
              {
                path: "hard-assets",
                element: <HardAssets />,
              },
              {
                path: "debt-inheritance",
                element: <DebtInheritance />,
              },
              {
                path: "social-insurance",
                element: <SocialInsurancePage />,
              },
              {
                path: "statement-wealth",
                element: <StatementWealthPage />,
              },
              {
                path: "contractual-wealth",
                element: <ContractualWealthPage />,
              },
              {
                path: "analysis",
                element: <Analysis />,
              },
            ],
          },
          {
            path: "calculator",
            element: <CalculatorMap />,
          },
        ],
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

  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  const [clientData, setClientData] = useState<Client | null>({} as any);
  return (
    <SuperTokensWrapper>
      <IncomeProvider data={clientData as any} setLocal={setClientData as any}>
        <RouterProvider router={router} />
      </IncomeProvider>
    </SuperTokensWrapper>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
