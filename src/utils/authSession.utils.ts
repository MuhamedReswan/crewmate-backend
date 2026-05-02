import { blacklistToken, getRedisData, getUserSession, setUserSession } from "./redis.util";
import { decodeRefreshToken } from "./jwt.util";
import { UnAuthorizedError } from "./errors/unAuthorized.error";

export const validateRefreshSession = async (refreshToken: string) => {
  
    if (!refreshToken) {
    throw new UnAuthorizedError("No refresh token provided");
  } 

    // Check blacklist
  const isBlacklisted = await getRedisData(`blacklist:${refreshToken}`);
  if (isBlacklisted) {
    throw new UnAuthorizedError("Refresh token is blacklisted");
  }

  // Decode token
  const decoded = decodeRefreshToken(refreshToken);
  if (!decoded) {
    throw new UnAuthorizedError("Invalid refresh token");
  }

  // Check session
  const currentSession = await getUserSession(decoded.id);

    if (!currentSession) {
    throw new UnAuthorizedError("Session not found (expired or logged out)");
  }


  if (currentSession !== refreshToken) {
    throw new UnAuthorizedError("Session expired");
  }

  return decoded;
};


export const handleSessionOnLogin = async (
  userId: string,
  newRefreshToken: string,
  oldRefreshToken?: string
) => {
  //  Invalidate old session
  if (oldRefreshToken) {
    const decodedOld = decodeRefreshToken(oldRefreshToken);

    if (decodedOld) {
      const ttlOld =
        decodedOld.exp - Math.floor(Date.now() / 1000);

      if (ttlOld > 0) {
        await blacklistToken(oldRefreshToken, ttlOld);
      }
    }
  }

  // Store new session
  const decodedNew = decodeRefreshToken(newRefreshToken);

  if (decodedNew) {
    const ttlNew =
      decodedNew.exp - Math.floor(Date.now() / 1000);

    if (ttlNew > 0) {
      await setUserSession(userId, newRefreshToken, ttlNew);
    }
  }
};