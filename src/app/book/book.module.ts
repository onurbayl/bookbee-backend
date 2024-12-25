import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity'
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { UserModule } from '../user/user.module';
import { GenreModule } from '../genre/genre.module' 

@Module({
  imports: [TypeOrmModule.forFeature([Book]), UserModule, GenreModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookRepository],
})
export class BookModule {}