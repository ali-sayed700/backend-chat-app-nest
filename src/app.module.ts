import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

import { MessageModule } from './message/message.module';
import { RoomModule } from './room/room.module';

import { AuthModule } from './auth/auth.module';

import typeormConfig from './database/typeorm.config';
import { ChatModule } from './geteway/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),
    UserModule,
    MessageModule,
    RoomModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
