import { Outlet } from "react-router-dom";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
const Root = () => {
  return (
    <SessionAuth>
      <Outlet />
    </SessionAuth>
  );
};

export default Root;
