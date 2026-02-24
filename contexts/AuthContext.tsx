import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export type WholesaleAccountStatus =
  | "not_found"
  | "pending_approval"
  | "approved_password_required"
  | "approved_setup_required";

type AuthUserData = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  canManagePromotions: boolean;
};

type AuthUser = AuthUserData | null;

type RegisterParams = {
  name: string;
  surname: string;
  phone: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string; code?: string }>;
  register: (
    payload: RegisterParams,
  ) => Promise<{ ok: boolean; status?: WholesaleAccountStatus; error?: string }>;
  getAccountStatus: (
    email: string,
  ) => Promise<{ ok: boolean; status?: WholesaleAccountStatus; error?: string }>;
  requestPasswordSetup: (
    email: string,
  ) => Promise<{
    ok: boolean;
    expiresAt?: string;
    setupToken?: string;
    error?: string;
  }>;
  completePasswordSetup: (payload: {
    email: string;
    setupToken: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

type ApiResponse<T> = {
  response: Response;
  data: T;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  return {
    response,
    data: await parseJson<T>(response),
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const { response, data } = await apiRequest<{ user?: AuthUserData }>(
          "/api/wholesale-auth-me",
          { method: "GET" },
        );

        if (!active) return;

        if (response.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsReady(true);
      }
    };

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const { response, data } = await apiRequest<{
        user?: AuthUserData;
        error?: string;
        code?: string;
      }>("/api/wholesale-auth-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok || !data.user) {
        return {
          ok: false,
          error: data.error || "Login failed",
          code: data.code,
        };
      }

      setUser(data.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const register: AuthContextValue["register"] = async (payload) => {
    try {
      const { response, data } = await apiRequest<{
        status?: WholesaleAccountStatus;
        error?: string;
      }>("/api/wholesale-auth-register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return { ok: false, error: data.error || "Registration failed" };
      }

      return { ok: true, status: data.status };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const getAccountStatus: AuthContextValue["getAccountStatus"] = async (
    email,
  ) => {
    try {
      const { response, data } = await apiRequest<{
        status?: WholesaleAccountStatus;
        error?: string;
      }>("/api/wholesale-auth-status", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!response.ok || !data.status) {
        return { ok: false, error: data.error || "Status check failed" };
      }

      return { ok: true, status: data.status };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const requestPasswordSetup: AuthContextValue["requestPasswordSetup"] = async (
    email,
  ) => {
    try {
      const { response, data } = await apiRequest<{
        expiresAt?: string;
        setupToken?: string;
        error?: string;
      }>("/api/wholesale-auth-request-password-setup", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return { ok: false, error: data.error || "Setup request failed" };
      }

      return {
        ok: true,
        expiresAt: data.expiresAt,
        setupToken: data.setupToken,
      };
    } catch {
      return { ok: false, error: "Network error" };
    }
  };

  const completePasswordSetup: AuthContextValue["completePasswordSetup"] =
    async ({ email, setupToken, password }) => {
      try {
        const { response, data } = await apiRequest<{
          user?: AuthUserData;
          error?: string;
        }>("/api/wholesale-auth-complete-password-setup", {
          method: "POST",
          body: JSON.stringify({
            email,
            setupToken,
            password,
          }),
        });

        if (!response.ok || !data.user) {
          return { ok: false, error: data.error || "Password setup failed" };
        }

        setUser(data.user);
        return { ok: true };
      } catch {
        return { ok: false, error: "Network error" };
      }
    };

  const logout = async () => {
    try {
      await apiRequest("/api/wholesale-auth-logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isReady,
    login,
    register,
    getAccountStatus,
    requestPasswordSetup,
    completePasswordSetup,
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

  const { isAuthenticated, isReady } = ctx;
  const location = useLocation();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-text-secondary">
        Verifica sessione...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return children;
};

export default AuthContext;
