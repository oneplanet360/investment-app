

import type { ReactNode } from "react";

//TODO: implement auth context later.

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <>
     {children}
    </>
  )
}
