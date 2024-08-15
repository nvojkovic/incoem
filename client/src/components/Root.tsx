import { Outlet } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { UserProvider } from "../useUser";
const Root = () => {
  return (
    <SessionAuth>
      <UserProvider>
        <Outlet />
      </UserProvider>
    </SessionAuth>
  );
};

export default Root;
