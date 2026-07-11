import { createContext } from "react";
import { useAdminVerifyUser } from "../services/admin/adminAuth/adminAuth.query";
import type { IAdmin } from "../services/admin/adminAuth/adminAuth.types";

interface AuthContextType {
  admin: IAdmin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
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

export { AuthContext, AuthProvider };
