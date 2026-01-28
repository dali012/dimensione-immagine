import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type AuthUser = { email: string; name?: string } | null;

type RegisterParams = { email: string; password: string; name?: string };

type AuthContextValue = {
  user: AuthUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (p: RegisterParams) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "mock_users";
const AUTH_USER_KEY = "auth_user";

function readUsers(): Array<{
  email: string;
  password: string;
  name?: string;
}> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser>(() => {
    try {
      const raw =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(AUTH_USER_KEY)
          : null;
      if (raw) return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_USER_KEY);
  }, [user]);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      const u = { email: found.email, name: found.name };
      setUser(u);
      return true;
    }
    return false;
  };

  const register = async ({ email, password, name }: RegisterParams) => {
    const users = readUsers();
    if (users.find((u) => u.email === email)) return false;
    users.push({ email, password, name });
    writeUsers(users);
    setUser({ email, name });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("RequireAuth must be used within AuthProvider");
  const { isAuthenticated } = ctx;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default AuthContext;
