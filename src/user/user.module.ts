import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],

  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
