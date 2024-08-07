import { PartialType } from '@nestjs/mapped-types';
import { SignupValidator } from 'src/auth/dto/signupValidator.dto';

// export class UpdateUserDto extends OmitType(PartialType(SignupValidator), [
//   'password',
// ] as const) {}
export class UpdateUserDto extends PartialType(SignupValidator) {}
