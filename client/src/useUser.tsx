import React, { createContext, useState, useContext, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { getUser, updateSettings } from "./services/client";
import { router } from "./main";
import { debounce } from "./utils";
import { User } from "./types";

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  updatePrimaryColor: (color: string) => Promise<void>;
  updateInfo: (settings: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  ignoreLogin?: boolean;
}> = ({ children, ignoreLogin = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = router.navigate;

  const fetchUser = async () => {
    if (ignoreLogin) return setUser({} as any);
    console.log("fetching user");
    try {
      const response = await getUser();
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
        if (userData?.info?.subsciptionStatus === "paused") {
          navigate("/paused");
        } else if (
          userData?.info?.subsciptionStatus !== "active" &&
          userData?.info?.subsciptionStatus !== "trialing"
        ) {
          navigate("/subscribe");
        }
        Sentry.setUser({ email: userData.info?.email, id: userData.userId });
      } else if (response.status === 401) {
        navigate("/login");
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updatePrimaryColor = async (color: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ primaryColor: color }),
      });

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser!,
          info: { ...prevUser!.info!, primaryColor: color },
        }));
      } else {
        throw new Error("Failed to update primary color");
      }
    } catch (error) {
      console.error("Error updating primary color:", error);
    }
  };

  const updateRemote = debounce(updateSettings, 500);

  const updateInfo = (settings: any) => {
    setUser((prevUser) => {
      updateRemote(settings);
      return {
        ...prevUser!,
        info: settings,
      };
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, fetchUser, updatePrimaryColor, updateInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
