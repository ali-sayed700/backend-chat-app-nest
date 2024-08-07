import { Request } from 'express';

// import { JwtStrategy } from '../strategy/jwt.strategy';
import { LocalStrategy } from '../strategy/local.strategy';

export interface AuthRequestLocal extends Request {
  user: Awaited<ReturnType<LocalStrategy['validate']>>;
}
