import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { UserProvider, useUser } from "../hooks/useUser";
import { useEffect } from "react";
import IntercomMessanger from "../services/intercom";
import Error from "src/pages/error";
import config from "src/services/config";
const Root = () => {
  return (
    <SessionAuth>
      <UserProvider>
        <Tmp />
      </UserProvider>
    </SessionAuth>
  );
};

function hexToRgb(hex: any) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : null;
}

const Tmp = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user?.info?.primaryColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        user.info.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--primary-color-segment",
        hexToRgb(user.info.primaryColor),
      );
    }
  }, [user]);

  const location = useLocation();
  if (!user || !user.info) return null;

  const u = {
    name: user?.info?.name || "",
    id: user?.userId,
    email: user?.info?.email,
    createdAt: Math.floor(user?.createdAt / 1000),
    hash: user.intercomHash,
  };
  console.log(u);

  const env = config.ENV;
  if (env === "local") {
    return <Outlet />;
  } else {
    return (
      <ErrorBoundary fallback={<Error />} key={location.pathname}>
        <IntercomMessanger user={u}>
          <Outlet />
        </IntercomMessanger>
      </ErrorBoundary>
    );
  }
};

export default Root;
