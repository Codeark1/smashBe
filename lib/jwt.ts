import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

export const signToken = (
  payload: string | object | Buffer,
  expiresIn: "1h" | "2h" | "7d" | "30d" = "7d",
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): object | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as object;
  } catch (error) {
    // Log error for debugging (remove in production)
    console.error(
      "JWT verification failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
};
