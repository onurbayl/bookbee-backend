import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Genre } from '../genre/genre.entity';
import { ShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Genre]), ShoppingCartModule, GenreModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository]
})
export class UserModule {}