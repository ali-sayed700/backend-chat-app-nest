import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { User } from 'src/user/user.entity';
import { Room } from 'src/room/room.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Room])],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
