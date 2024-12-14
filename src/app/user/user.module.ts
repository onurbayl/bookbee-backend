import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Genre } from '../genre/genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Genre])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, UserService]
})
export class UserModule {}