import { Outlet } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { UserProvider, useUser } from "../useUser";
import { useEffect } from "react";
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

  return <Outlet />;
};

export default Root;
