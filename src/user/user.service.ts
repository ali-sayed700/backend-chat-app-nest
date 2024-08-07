import {
  ConflictException,
  // ConflictException,
  Injectable,
  NotFoundException,

  // NotFoundException,
  // UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from './user.entity';
import { SignupValidator } from 'src/auth/dto/signupValidator.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Hash } from 'src/common/utils/hash.util';
import { SearchUsersDto } from './dto/searchUser.dto';

// import { UpdateUserDto } from './dto/updateUser.dto';

// import { Hash } from 'src/common/utils/hash.util';
// import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'username'],
    });
  }
  searchUsers(searchUsersDto: SearchUsersDto) {
    return this.userRepository.find({
      where: { username: ILike(`%${searchUsersDto.username}%`) },
      skip: searchUsersDto.skip,
      take: searchUsersDto.take,
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(signupValidator: SignupValidator): Promise<any> {
    const foundUser = await this.getUserByEmail(signupValidator.email);
    if (foundUser) {
      throw new ConflictException('Email already in use');
    }
    const user = await this.userRepository.create(signupValidator);
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // 1) find user to update

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Not found user for this id :  ${id}`);
    }
    if (updateUserDto.password) {
      user.password = await Hash.generateHash(updateUserDto.password);
    }
    const updatedUser = { ...user, ...updateUserDto };
    // user.password = updateUserDto.password;
    // 2) update the element
    return await this.userRepository.save(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async setRequest({
    id,
    otherId,
    status,
  }: {
    id: string;
    otherId: string;
    status: boolean;
  }): Promise<any> {
    const firstUser = await this.userRepository.findOneBy({ id });
    const secondUser = await this.userRepository.findOneBy({ id: otherId });

    // Check if user exists
    if (!firstUser || !secondUser)
      throw new NotFoundException('User not found.');

    // Check if user is blocked
    if (
      (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
      (secondUser.blocked && secondUser.blocked.includes(id))
    ) {
      return {
        statusCode: '406',
        message: 'You cannot do this. You are blocked.',
      };
    }
    // Check if users are friends

    if (status && secondUser.friends && secondUser.friends.includes(id)) {
      return {
        statusCode: '406',
        message: 'You are already friends.',
      };
    }

    if (status && secondUser.requests && secondUser.requests.includes(id)) {
      return {
        statusCode: '409',
        message: 'You already sent a request to this user.',
      };
    }

    if (status) {
      // secondUser.requests = [...(secondUser.requests || []), firstUser];
      secondUser.requests.push(id);
    } else {
      // secondUser.requests = secondUser.requests.filter(
      //   (request) => request.id !== id,
      // );
      secondUser.requests = secondUser.requests.filter((reqId) => reqId !== id);
    }

    await this.userRepository.save(secondUser);

    return {
      statusCode: '200',
      message: 'User updated successfully.',
    };
  }

  async getRequests(id: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException('User not found.');

      return {
        statusCode: '200',
        requests: user.requests,
      };
    } catch {
      return {
        statusCode: '404',
        message: 'Requests not found.',
      };
    }
  }

  async setFriend({
    id,
    otherId,
    status,
  }: {
    id: string;
    otherId: string;
    status: boolean;
  }) {
    const firstUser = await this.userRepository.findOneBy({ id });
    const secondUser = await this.userRepository.findOneBy({ id: otherId });

    // Check if user exists
    if (!firstUser || !secondUser)
      throw new NotFoundException('User not found.');

    // Check if user is blocked
    if (
      (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
      (secondUser.blocked && secondUser.blocked.includes(id))
    ) {
      return {
        statusCode: '406',
        message: 'You cannot do this. You are blocked.',
      };
    }

    // Check if users are friends
    if (status && firstUser.friends && firstUser.friends.includes(otherId)) {
      return {
        statusCode: '409',
        message: 'You are already friends.',
      };
    }

    if (status) {
      await this.setRequest({ id: otherId, otherId: id, status: false });

      firstUser.friends.push(secondUser.id);
      secondUser.friends.push(firstUser.id);

      // await this.userRepository.save(firstUser);
      // await this.userRepository.save(secondUser);
    } else {
      firstUser.friends = firstUser.friends.filter((user) => user !== otherId);
      secondUser.friends = secondUser.friends.filter((user) => user !== id);
    }

    await this.userRepository.save(firstUser);
    await this.userRepository.save(secondUser);

    return {
      statusCode: '200',
      message: 'User updated successfully.',
    };
  }

  async getFriends(id: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('User not found.');

      return {
        statusCode: '200',
        friends: user.friends,
      };
    } catch (error) {
      return {
        statusCode: '404',
        message: 'Friends not found.',
      };
    }
  }

  async setBlocked({
    id,
    otherId,
    status,
  }: {
    id: string;
    otherId: string;
    status: boolean;
  }): Promise<any> {
    const firstUser = await this.userRepository.findOneBy({ id });
    const secondUser = await this.userRepository.findOneBy({ id: otherId });

    if (!firstUser || !secondUser)
      throw new NotFoundException('User not found.');

    if (status && firstUser.blocked && firstUser.blocked.includes(otherId)) {
      return {
        statusCode: '409',
        message: 'This user has already been blocked.',
      };
    }

    await this.setRequest({ id: otherId, otherId: id, status: false });

    if (status) {
      await this.setFriend({ id, otherId, status: false });
      await this.setRequest({ id, otherId, status: false });

      firstUser.blocked.push(secondUser.id);
    } else {
      firstUser.blocked = firstUser.blocked.filter(
        (blockedUser) => blockedUser !== otherId,
      );
    }

    await this.userRepository.save(firstUser);

    return {
      statusCode: '200',
      message: 'User updated successfully.',
    };
  }

  async getBlocked(id: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('User not found.');

      return {
        statusCode: '200',
        blocked: user.blocked,
      };
    } catch {
      return {
        statusCode: '404',
        message: 'Blocked users not found.',
      };
    }
  }
}
