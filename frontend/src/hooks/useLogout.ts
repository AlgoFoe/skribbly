import { useState } from "react";
import useAuthContext  from "./useAuthContext";
import toast from "react-hot-toast";

// Define the type for the API response
interface ApiResponse {
  error?: string;
}

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data: ApiResponse = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.removeItem("current-user");
      setAuthUser(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
