import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequestLocal } from 'src/auth/interface/auth-request-local.interface';

export const AuthUserLocal = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthRequestLocal>();

    return req.user;
  },
);
