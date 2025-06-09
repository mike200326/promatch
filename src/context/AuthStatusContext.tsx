// src/context/AuthStatusContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthStatusContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthStatusContext = createContext<AuthStatusContextType | undefined>(undefined);

export const AuthStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthStatusContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthStatusContext.Provider>
  );
};

export const useAuthStatus = () => {
  const context = useContext(AuthStatusContext);
  if (!context) {
    throw new Error("useAuthStatus must be used within an AuthStatusProvider");
  }
  return context;
};
