import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AuthUser } from "../context/AuthContext";

interface UseLoginReturn {
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
}

interface ApiResponse {
  error?: string;
  _id?: string;
  fullName?: string;
  username?: string;
  password?: string;
  gender?: string;
  colorXY?: number[];
  eyesXY?: number[];
  mouthXY?: number[];
}

const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<void> => {
    const success = handleInputErrors(username, password);
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        // Handle HTTP errors
        const errorMessage = data.error || `HTTP error! Status: ${res.status}`;
        throw new Error(errorMessage);
      }

      if (data._id && data.username) {
        const user: AuthUser = {
          _id: data._id,
          fullName: data.fullName!,
          username: data.username,
          colorXY: data.colorXY || [],
          eyesXY: data.eyesXY || [],
          mouthXY: data.mouthXY || [],
        };
        localStorage.setItem("current-user", JSON.stringify(user));
        setAuthUser(user);
        navigate("/");
        toast.success("Login successful!");
      } else {
        throw new Error("Unexpected response format");
      }
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

  return { loading, login };
};

export default useLogin;

function handleInputErrors(username: string, password: string): boolean {
  if (!username || !password) {
    toast.error("Please fill in all fields");
    return false;
  }
  return true;
}
