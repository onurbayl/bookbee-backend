import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity'
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), UserModule], //If you need UserRepository, import UserModule
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookRepository], //For sharing repository layer
})
export class BookModule {}