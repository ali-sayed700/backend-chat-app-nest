import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  readonly room_id: string;

  @IsString()
  readonly user_id: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  text: string;

  @IsOptional()
  images?: string[];
}
