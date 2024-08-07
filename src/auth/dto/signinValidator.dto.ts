import { OmitType } from '@nestjs/mapped-types';
import { SignupValidator } from './signupValidator.dto';

export class SigninValidator extends OmitType(SignupValidator, [
  'username',
] as const) {}
