import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { UserProvider, useUser } from "../useUser";
import { useEffect } from "react";
import IntercomMessanger from "../intercom";
import Error from "src/pages/error";
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
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
  return (
    <IntercomMessanger user={u}>
      <Outlet />
    </IntercomMessanger>
  );
};

// <ErrorBoundary fallback={<Error />} key={location.pathname}>
//   <Outlet />
// </ErrorBoundary>
//
export default Root;
