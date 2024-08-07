import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    } as StrategyOptions);
  }
  // async validate(payload: JwtPayload) {
  //   return { id: payload.userId };
  // }

  async validate(payload: JwtPayload) {
    // console.log(payload);

    return { id: payload.id, username: payload.username, image: payload.image };
  }
}
