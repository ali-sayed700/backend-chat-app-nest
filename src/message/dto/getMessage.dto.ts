import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @Type(() => String)
  readonly roomId: string;
}
