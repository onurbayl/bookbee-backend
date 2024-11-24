import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity'; //Import entities
import { BookRepository } from './book.repository';  // Import custom repository
import { BookNotFoundException } from './exceptions/book-not-found.exception';
import { exampleDTO } from "./dtos/example-dto"

@Injectable()
export class BookService {
  constructor( //Injects repositories that you want to use
    @InjectRepository(BookRepository)
    private readonly bookRepository: BookRepository,
  ) {}

  async findBookByName(name: string): Promise<exampleDTO> {
    const rBook = await this.bookRepository.findByName(name);

    if (rBook == null) { //No need for try and catch, we use global exception handler. But you need to define custom exception.
      BookNotFoundException.byName(name);
    }

    return rBook;
  }


}