import { Module } from '@nestjs/common';

import { RoomGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [MessageModule],
  providers: [RoomGateway],
})
export class ChatModule {}
