import jwt from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return secret;
};

export const createAuthToken = (userId: string): string =>
  jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "7d" });

export const getUserIdFromAuthorizationHeader = (
  authorizationHeader?: string,
): string | null => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

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
