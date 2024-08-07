import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';

export class SignupValidator {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;

  image?: string;
  // friends?: string[];
  // blocked?: string[];
  // requests?: string[];
}
