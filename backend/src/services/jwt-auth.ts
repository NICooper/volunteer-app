import fs from 'fs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { User } from '../types/user';
import { JwtPayload } from '@shared/types/jwt-payload';

const PUBLIC_KEY = fs.readFileSync('./public_key.pem', 'utf8');
const PRIVATE_KEY = fs.readFileSync('./private_key.pem', 'utf8');

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUBLIC_KEY,
  ignoreExpiration: false,
  jsonWebTokenOptions: {
    maxAge: '1d'
  }
}

export function issueJWT(user: User): string {
  const payload = {
    sub: user.id,
    rol: user.role,
    iat: Math.floor(Date.now() / 1000)
  }
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '1d' });
}

export const jwtStrategy = new Strategy(jwtOptions, 
  (jwtPayload: JwtPayload, done) => {
    console.log('JWT payload received:', jwtPayload);
    done(null, { id: jwtPayload.sub, role: jwtPayload.rol });
  }
);

export const jwtAuth = passport.authenticate('jwt', { session: false });
