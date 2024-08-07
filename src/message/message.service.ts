import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { CreateMessageDto } from './dto/createMessage.dto';
import { User } from 'src/user/user.entity';
import { Room } from 'src/room/room.entity';
import { UpdateMsgDto } from './dto/updateMessage.dto';
// import { GetMessagesDto } from './dto/getMessage.dto';
// import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async addMessage({ text, images, room_id, user_id }: CreateMessageDto) {
    const strRoom = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    const strUser = await this.userRepository.findOne({
      where: { id: user_id },
    });
    try {
      const message = this.messageRepository.create({
        roomId: strRoom,
        userId: strUser,
        text,
        images,
      });

      await this.messageRepository.save(message);
      return {
        statusCode: '201',
        message: 'Message created successfully.',
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: error,
      };
    }
  }
  async getMessage(id: string) {
    try {
      const message = await this.messageRepository.findOne({
        where: { id },
        relations: ['user', 'room'],
      });

      if (!message) {
        throw new NotFoundException(`message with id ${id} not found`);
      }

      return message;
    } catch (error) {
      return {
        statusCode: '404',
        message: 'Message not found.',
      };
    }
  }

  async getMessageByRoom(id: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: { id: id },
      });
      if (!room) {
        throw new NotFoundException(`Not found room for this id :  ${id}`);
      }
      const messages = await this.messageRepository.find({
        where: { roomId: { id } },
        relations: ['room'],
      });
      return {
        messages,
      };
    } catch (error) {
      return {
        statusCode: '404',
        message: 'Message not found.',
      };
    }
  }

  async update(id: string, { text, images, room_id, user_id }: UpdateMsgDto) {
    const strRoom = await this.roomRepository.findOne({
      where: { id: room_id },
    });
    const strUser = await this.userRepository.findOne({
      where: { id: user_id },
    });
    try {
      const updateMsg = await this.messageRepository.preload({
        id,
        text,
        images,
        userId: strUser,
        roomId: strRoom,
      });
      const UpdateMessages = await this.messageRepository.save(updateMsg);
      return {
        statusCode: '200',
        message: 'Message updated successfully.',
        UpdateMessages,
      };
    } catch (error) {
      return {
        statusCode: '404',
        message: 'Message not found.',
      };
    }
  }

  async deleteMsg(id: string) {
    const result = await this.messageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`message with id ${id} not found`);
    } else {
      return {
        Message: 'deleted successfully',
      };
    }
  }
}
