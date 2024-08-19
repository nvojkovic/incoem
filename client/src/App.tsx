import "./App.css";
import { useUser } from "./useUser";
import { useEffect } from "react";

function App({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  useEffect(() => {
    if (user?.info?.primaryColor) {
      document.documentElement.style.setProperty(
        "--primary-color",
        user.info.primaryColor,
      );
    }
  }, [user]);

  return <div>{children}</div>;
}

export default App;
