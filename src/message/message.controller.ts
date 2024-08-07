import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/createMessage.dto';
import { MessageService } from './message.service';
import { UpdateMsgDto } from './dto/updateMessage.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post()
  createMessages(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.addMessage(createMessageDto);
  }
  @Get(':id')
  getMessage(@Param('id', ParseUUIDPipe) id: string) {
    return this.messageService.getMessage(id);
  }

  @Get('room/:id')
  getMessageByRoom(@Param('id', ParseUUIDPipe) id: string) {
    return this.messageService.getMessageByRoom(id);
  }
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateMsgDto,
  ) {
    const result = await this.messageService.update(id, body);
    return result;
  }

  @Delete(':id')
  deleteMsg(@Param('id', ParseUUIDPipe) id: string) {
    return this.messageService.deleteMsg(id);
  }
}
