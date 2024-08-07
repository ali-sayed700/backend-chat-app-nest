import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignupValidator } from './dto/signupValidator.dto';

import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException();

    const same = await bcrypt.compare(password, user.password);
    if (same) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async signup(signupValidator: SignupValidator) {
    const foundUser = await this.userService.getUserByEmail(
      signupValidator.email,
    );
    if (foundUser) {
      throw new ConflictException('Email already in use');
    }

    await this.userService.createUser(signupValidator);
    return {
      statusCode: '201',
      message: 'User created successfully.',
    };
  }

  async signin(dataValues) {
    const payload = {
      id: dataValues.id,
      username: dataValues.username,
      image: dataValues.image,
    };
    return {
      statusCode: '200',
      message: 'User log in successfully.',
      token: this.jwtService.sign(payload),
    };
  }
}
