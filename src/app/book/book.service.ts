import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity'; //Import entities
import { BookRepository } from './book.repository';  // Import custom repository
import { BookNotFoundException } from './exceptions/book-not-found.exception';
import { UserRepository } from 'src/app/user/user.repository';

@Injectable()
export class BookService {
  constructor( //Injects repositories that you want to use
    @InjectRepository(BookRepository)
    private readonly bookRepository: BookRepository,

    @InjectRepository(UserRepository) //You can get other repositories like this. Dont forget module file imports.
    private readonly userRepository: UserRepository,
  ) {}

  async findBookByName(name: string): Promise<Book> {

    //Getting everything about object.
    const rBook2 = await this.bookRepository.findByName(name); //dont forget await for repository calls.

    //For debugging
    const rBook23 = JSON.stringify(rBook2);
    console.log(rBook23);

    //Testing - outside injection
    const ruser = await this.userRepository.findById(1);
    console.log( JSON.stringify(ruser) )

    if (rBook2 == null) { //No need for try and catch, we use global exception handler. But you need to define custom exception.
      BookNotFoundException.byName(name);
    }

    return rBook2;
  }


}