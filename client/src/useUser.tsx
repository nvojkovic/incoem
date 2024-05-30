import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "./services/client";

const useUser = () => {
  const [user, setUser] = useState(null as any);
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const response = await getUser();
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        if (userData?.info?.subsciptionStatus == "paused") {
          navigate("/paused");
        } else if (
          userData?.info?.subsciptionStatus !== "active" &&
          userData?.info?.subsciptionStatus !== "trialing"
        ) {
          navigate("/subscribe");
        }
      } else if (response.status === 401) {
        // Redirect to login if unauthorized
        console.log("Unauthorized");
        navigate("/login");
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Handle other errors as needed
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, fetchUser };
};

export default useUser;
