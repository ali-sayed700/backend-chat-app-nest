import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
// import { DeepPartial } from 'typeorm';

export class CreateRoomDto {
  @IsString()
  userId: string;

  @IsString({ each: true })
  participants: string[];

  @IsString({ each: true })
  admins?: string[];

  @IsString()
  image: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  description: string;
}
