import { createContext } from "react";
import { useClientVerifyUser } from "../services/client/clientAuth/clientAuth.query";
import type { IClientUser } from "../services/client/clientAuth/clientAuth.types";

interface ClientAuthContextType {
  user: IClientUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useClientVerifyUser();
  const user = data?.data && !isError ? data.data : null;

  return (
    <ClientAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export { ClientAuthContext, ClientAuthProvider };
