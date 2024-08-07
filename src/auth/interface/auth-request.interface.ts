import { Request } from 'express';

import { JwtStrategy } from '../strategy/jwt.strategy';

export interface AuthRequest extends Request {
  user: Awaited<ReturnType<JwtStrategy['validate']>>;
}
