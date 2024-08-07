import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './createRoom.dto';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

// import {
//   IsArray,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   MaxLength,
//   MinLength,
// } from 'class-validator';
// import { User } from 'src/user/user.entity';

// export class UpdateRoomDto {
//   @IsOptional()
//   @IsString()
//   userId?: string;

//   @IsOptional()
//   @IsArray()
//   participants?: User[];

//   @IsOptional()
//   @IsArray()
//   admins?: User[];

//   @IsOptional()
//   @IsString()
//   image?: string;

//   @IsOptional()
//   @IsNotEmpty()
//   @MinLength(1)
//   @MaxLength(100)
//   name?: string;

//   //   @IsNotEmpty()
//   @IsOptional()
//   @IsNotEmpty()
//   @MinLength(1)
//   @MaxLength(1000)
//   description?: string;
// }
