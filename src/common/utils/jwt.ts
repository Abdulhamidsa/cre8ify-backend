import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  friendlyId?: string;
  userRole?: string;
}

export const generateAccessToken = (user: UserPayload): string => {
  const payload = {
    id: user.id,
    friendlyId: user.friendlyId,
    userRole: user.userRole,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.ACCESSTOKEN_EXPIRATION || "10m",
  });
  return token;
};

export const generateRefreshToken = (user: UserPayload): string => {
  const payload = { id: user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.REFRESHTOKEN_EXPIRATION || "1d",
  });
  return token;
};

export const verifyToken = async (token: string, tokenType: "access" | "refresh"): Promise<jwt.JwtPayload | string> => {
  if (!token) {
    throw { message: "Token is required", status: 401 };
  }
  try {
    return await jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    const errorMessages: { [key: string]: string } = {
      JsonWebTokenError: tokenType === "access" ? "Access token is invalid" : "Refresh token is invalid",
      TokenExpiredError: tokenType === "access" ? "Access token has expired" : "Refresh token has expired",
    };
    const message = errorMessages[error.name] || "Token verification failed";
    const status = error.name === "TokenExpiredError" ? 401 : 403;
    throw { message, status };
  }
};
