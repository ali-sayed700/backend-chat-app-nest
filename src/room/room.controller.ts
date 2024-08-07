import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { RoomService } from './room.service';

import { CreateRoomDto } from './dto/createRoom.dto';
import { Room } from './room.entity';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { SearchRoomsDto } from './dto/searchRoom.dto';

@Controller('room')
// @UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Body() body: CreateRoomDto) {
    const result = await this.roomService.createChannel(body);
    return result;
  }
  @Get('search')
  searchRooms(@Query() searchRoomsDto: SearchRoomsDto) {
    return this.roomService.searchRooms(searchRoomsDto);
  }

  @Get(':id')
  async getRoom(@Param('id', ParseUUIDPipe) id: string): Promise<Room> {
    return await this.roomService.getRoom(id);
  }

  @Get('user/:userId')
  async getChannelByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    const channels = await this.roomService.getChannelsByUser(userId);
    return channels;
  }

  @Put(':id')
  async updateChannel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRoomDto,
  ) {
    const result = await this.roomService.update(id, body);
    return result;
  }

  @Delete(':id')
  async deleteRoom(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.roomService.deleteRoom(id);
  }
}
