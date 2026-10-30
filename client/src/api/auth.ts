const AUTH_TOKEN_KEY = "fitness-agent-auth-token";

export const getAuthToken = (): string | null => {
  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null): void => {
  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    return;
  }
};
