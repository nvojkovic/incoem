import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "./services/client";

interface User {
  info?: {
    subsciptionStatus?: string;
    stabilityRatioFlag: boolean;
    logo?: string;
    email: string;
    name?: string;

    primaryColor: string;
  };
  createdAt: number;
  intercomHash: string;
  userId: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  fetchUser: () => Promise<void>;
  updatePrimaryColor: (color: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  ignoreLogin?: boolean;
}> = ({ children, ignoreLogin = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (ignoreLogin) return setUser({} as any);
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
      } else if (response.status === 401) {
        console.log("Unauthorized");
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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, updatePrimaryColor }}>
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
