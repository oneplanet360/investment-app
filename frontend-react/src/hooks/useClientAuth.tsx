import { useContext } from 'react'
import { ClientAuthContext } from '../context/client-auth.provider'

export default function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
