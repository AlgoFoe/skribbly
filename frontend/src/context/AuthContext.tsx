import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect, useContext } from "react";

// Define the shape of the user object
export interface AuthUser {
  _id: string;
  fullName: string;
  username: string;
  colorXY: number[];
  mouthXY: number[];
  eyesXY: number[];
}

// Define the shape of the context
export interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: Dispatch<SetStateAction<AuthUser | null>>;
}

// Provide a default value for the context
const defaultValue: AuthContextType = {
  authUser: null,
  setAuthUser: () => {} // Use a no-op function here; this will be overridden by the actual function
};

// Create the AuthContext
export const AuthContext = createContext<AuthContextType>(defaultValue);

// Define the props for the provider component
interface AuthContextProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  // Initialize state with data from localStorage
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("current-user") || "null")
  );

  // Update localStorage whenever authUser changes
  useEffect(() => {
    localStorage.setItem("current-user", JSON.stringify(authUser));
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};
