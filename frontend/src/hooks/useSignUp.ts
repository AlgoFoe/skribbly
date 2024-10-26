import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { AuthUser } from "../context/AuthContext";

interface SignupParams {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
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

interface UseSignupReturn {
  loading: boolean;
  signup: (params: SignupParams) => Promise<void>;
}

const useSignup = (): UseSignupReturn => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();

  const signup = async (params: SignupParams): Promise<void> => {
    const success = handleInputErrors(params);
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data: ApiResponse = await res.json();
      if (data.error) {
        throw new Error(data.error);
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

  return { loading, signup };
};

export default useSignup;

function handleInputErrors(params: SignupParams): boolean {
  const { fullName, username, password, confirmPassword, gender } = params;

  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
