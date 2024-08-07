import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { User } from 'src/user/user.entity';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { SearchRoomsDto } from './dto/searchRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createChannel({
    participants,
    admins,
    image,
    name,
    description,
    userId,
  }: CreateRoomDto) {
    try {
      const participantUser = await Promise.all(
        participants.map((x) => this.preloadPartById(x)),
      );

      const adminUser = await Promise.all(
        admins.map((x) => this.preloadPartById(x)),
      );

      const channel = this.roomRepository.create({
        participants: participantUser,
        admins: adminUser,
        userId: { id: userId },
        image,
        name,
        description,
      });

      await this.roomRepository.save(channel);

      return {
        statusCode: '201',
        message: 'Channel created successfully.',
        channel,
      };
    } catch (error) {
      return {
        statusCode: '400',
        message: error.message,
      };
    }
  }

  async searchRooms(searchRoomsDto: SearchRoomsDto) {
    const srchRoom = this.roomRepository.createQueryBuilder('room');
    if (searchRoomsDto.skip) {
      srchRoom.skip(searchRoomsDto.skip);
    }
    if (searchRoomsDto.take) {
      srchRoom.take(searchRoomsDto.take);
    }
    if (searchRoomsDto.name) {
      srchRoom.andWhere('room.name ILIKE :name', {
        name: `%${searchRoomsDto.name}%`,
      });
    }
    if (searchRoomsDto.userId) {
      srchRoom.andWhere('room.userId = :userId', {
        userId: searchRoomsDto.userId,
      });
    }
    const [items, count] = await srchRoom.getManyAndCount();
    return { items, count };
  }

  async getRoom(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['participants', 'admins', 'userId'],
    });

    if (!room) {
      throw new NotFoundException(`Not found user for this id :  ${id}`);
    }
    return room;
  }

  async getChannelsByUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(`Not found user for this id :  ${userId}`);
      }

      const channels = await this.roomRepository.find({
        where: { participants: { id: userId } },
        order: { updatedAt: 'DESC' },
        relations: ['participants'],
      });

      return {
        channels,
      };
    } catch {
      return {
        statusCode: '404',
        message: 'User or channel not found.',
      };
    }
  }

  async update(
    id: string,
    { userId, description, image, name, participants, admins }: UpdateRoomDto,
  ) {
    const participantUser =
      participants &&
      (await Promise.all(participants.map((x) => this.preloadPartById(x))));

    const adminUser =
      admins && (await Promise.all(admins.map((x) => this.preloadPartById(x))));

    const updateStudent = await this.roomRepository.preload({
      id,
      participants: participantUser,
      admins: adminUser,
      userId: { id: userId },
      image,
      name,
      description,
    });
    if (!updateStudent) {
      throw new NotFoundException(`Not found user for this id : ${id}`);
    }
    return this.roomRepository.save(updateStudent);
  }

  async remove(id: string) {
    await this.roomRepository.delete(id);
  }

  async deleteRoom(id: string): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  private async preloadPartById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`Not found user for this id : ${id}`);
    }
  }
}
