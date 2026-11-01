import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "fitness_agent_token";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return secret;
};

export const createAuthToken = (
  userId: string,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d",
): string => jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn });

const getTokenFromAuthorizationHeader = (
  authorizationHeader?: string,
): string | null => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  return token || null;
};

const getTokenFromCookieHeader = (cookieHeader?: string): string | null => {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const name = part.slice(0, separatorIndex).trim();

    if (name !== AUTH_COOKIE_NAME) {
      continue;
    }

    const value = part.slice(separatorIndex + 1).trim();

    if (!value) {
      return null;
    }

    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return null;
};

const getUserIdFromToken = (token: string | null): string | null => {
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (typeof payload === "string" || !payload.sub) {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
};

export const getUserIdFromAuthorizationHeader = (
  authorizationHeader?: string,
): string | null =>
  getUserIdFromToken(getTokenFromAuthorizationHeader(authorizationHeader));

export const getUserIdFromRequest = (request: Request): string | null => {
  const headerToken = getTokenFromAuthorizationHeader(
    request.headers.authorization,
  );
  const cookieToken = getTokenFromCookieHeader(request.headers.cookie);

  return getUserIdFromToken(headerToken ?? cookieToken);
};

const getCookieOptions = (rememberMe: boolean) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
});

export const setAuthCookie = (
  response: Response,
  token: string,
  rememberMe = false,
): void => {
  response.cookie(AUTH_COOKIE_NAME, token, getCookieOptions(rememberMe));
};

export const clearAuthCookie = (response: Response): void => {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
};
