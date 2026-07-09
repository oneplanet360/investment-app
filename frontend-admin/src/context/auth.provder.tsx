import { createContext, useContext } from "react";
import { useAdminVerifyUser } from "../services/adminAuth/adminAuth.query";
import type { IAdmin } from "../services/adminAuth/adminAuth.types";

interface AuthContextType {
  admin: IAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useAdminVerifyUser();
  const admin = data?.data && !isError ? data.data : null;

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
