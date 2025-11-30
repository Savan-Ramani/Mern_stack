import jwt from 'jsonwebtoken';
import config from '../config';

export const signJwt = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};
