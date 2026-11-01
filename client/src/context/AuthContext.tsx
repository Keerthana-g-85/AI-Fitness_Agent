import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser } from "../api/authApi";
import { getMyProfile, profileQueryKeys } from "../api/profileApi";
import { setAuthToken } from "../api/auth";
import { useOnboarding } from "./OnboardingContext";
import type { AuthUser, LoginInput, LoginResponse } from "../types/profile";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const { resetOnboarding } = useOnboarding();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const profile = await getMyProfile();
      setUser(profile.user);
      queryClient.setQueryData(profileQueryKeys.me, profile);

      return profile.user;
    } catch {
      setUser(null);
      return null;
    }
  }, [queryClient]);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const profile = await getMyProfile();

        if (!active) {
          return;
        }

        setUser(profile.user);
        queryClient.setQueryData(profileQueryKeys.me, profile);
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [queryClient]);

  const login = useCallback(
    async (input: LoginInput): Promise<LoginResponse> => {
      const response = await loginUser(input);

      if (response.success && response.user) {
        setAuthToken(null);
        setUser(response.user);
        queryClient.removeQueries({ queryKey: profileQueryKeys.me });
        queryClient.removeQueries({ queryKey: profileQueryKeys.dashboard });
      }

      return response;
    },
    [queryClient],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      setAuthToken(null);
      setUser(null);
      resetOnboarding();
      queryClient.clear();
    }
  }, [queryClient, resetOnboarding]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
