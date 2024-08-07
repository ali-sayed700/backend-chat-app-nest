import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignupValidator } from './dto/signupValidator.dto';
import { AuthResponse } from './interface/auth-response.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUserLocal } from 'src/common/decorators/auth-user-local.decorator';
import { AuthRequestLocal } from './interface/auth-request-local.interface';
// import { SigninValidator } from './dto/signinValidator.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupValidator: SignupValidator): Promise<AuthResponse> {
    return this.authService.signup(signupValidator);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signin(@AuthUserLocal() user: AuthRequestLocal): Promise<AuthResponse> {
    return this.authService.signin(user);
  }
}
