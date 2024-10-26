import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

// Custom hook to use the AuthContext
const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export default useAuthContext;
