"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (auth.isAuthenticated()) {
          const response = await auth.verify();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            auth.logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        auth.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    try {
      // Token is already set in localStorage by auth.login
      const response = await auth.verify();
      if (response.success && response.data) {
        setUser(response.data);
        router.push("/nostalgia");
      } else {
        throw new Error("Failed to verify token");
      }
    } catch (error) {
      auth.logout();
      throw error;
    }
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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