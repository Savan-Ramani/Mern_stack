import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';

const JWT_SECRET: Secret = config.jwtSecret;

export const signJwt = (payload: object) => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any // <- FIX HERE
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
