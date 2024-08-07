import {
  Body,
  Controller,
  Delete,
  // Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { SearchUsersDto } from './dto/searchUser.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Get('search')
  async searchUsers(@Query() searchUsersDto: SearchUsersDto) {
    return await this.userService.searchUsers(searchUsersDto);
  }
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.getUser(id);
  }

  @Put()
  async updateUser(
    @AuthUser() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(user.id, updateUserDto);
  }
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(
    @AuthUser()
    user: JwtPayload,
  ) {
    return this.userService.deleteUser(user.id);
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id/request')
  async setRequest(
    @Param('id') id: string,
    @Body() body: { otherId: string; status: boolean },
  ) {
    const result = await this.userService.setRequest({ id, ...body });
    return result;
  }
  @Get(':id/request')
  async getRequest(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.userService.getRequests(id);
    return result;
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id/friend')
  async setFriend(
    @Param('id') id: string,
    @Body() body: { otherId: string; status: boolean },
  ) {
    return await this.userService.setFriend({ id, ...body });
  }

  @Get(':id/friend')
  async getFriends(@Param('id') id: string) {
    const result = await this.userService.getFriends(id);
    return result;
  }

  @Put(':id/block')
  async setBlocked(
    @Param('id') id: string,
    @Body() body: { otherId: string; status: boolean },
  ) {
    const result = await this.userService.setBlocked({ id, ...body });
    return result;
  }

  @Get(':id/block')
  async getBlocked(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.userService.getBlocked(id);
    return result;
  }
}
