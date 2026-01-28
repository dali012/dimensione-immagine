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

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const pattern = "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)";
  const matches = document.cookie.match(new RegExp(pattern));
  return matches ? decodeURIComponent(matches[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const hostname = window.location.hostname.replace(/^www\./, "");
  const domain = "." + hostname; // e.g. .example.com to cover www and apex
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};domain=${domain};path=/`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  const hostname = window.location.hostname.replace(/^www\./, "");
  const domain = "." + hostname;
  document.cookie = `${name}=;max-age=0;domain=${domain};path=/`;
}

function readUsers(): Array<{
  email: string;
  password: string;
  name?: string;
}> {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(USERS_KEY) : null;
    if (raw) return JSON.parse(raw);
    const cookieRaw = getCookie(USERS_KEY);
    if (cookieRaw) return JSON.parse(cookieRaw);
    return [];
  } catch (err) {
    console.debug("readUsers error", err);
    return [];
  }
}

function writeUsers(users: any[]) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setCookie(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.debug("writeUsers error", err);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser>(() => {
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(AUTH_USER_KEY) : null;
      if (raw) return JSON.parse(raw);
      const cookieRaw = getCookie(AUTH_USER_KEY);
      if (cookieRaw) return JSON.parse(cookieRaw);
      return null;
    } catch (err) {
      console.debug("init auth user parse error", err);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        if (typeof localStorage !== "undefined") localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        setCookie(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        if (typeof localStorage !== "undefined") localStorage.removeItem(AUTH_USER_KEY);
        deleteCookie(AUTH_USER_KEY);
      }
    } catch (err) {
      console.debug("persist auth_user error", err);
    }
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
    console.debug("registered user", email);
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
