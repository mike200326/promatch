"use client";
import React, { createContext, useContext, useState } from "react";

interface AuthUIContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const AuthUIContext = createContext<AuthUIContextType | undefined>(undefined);

export const AuthUIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthUIContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthUIContext.Provider>
  );
};

export const useAuthUI = () => {
  const context = useContext(AuthUIContext);
  if (!context) {
    throw new Error("useAuthUI must be used within an AuthUIProvider");
  }
  return context;
};
