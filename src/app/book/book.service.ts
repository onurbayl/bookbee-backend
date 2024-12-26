import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity'; //Import entities
import { BookRepository } from './book.repository';  // Import custom repository
import { BookNotFoundException } from './exceptions/book-not-found.exception';
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { UserRepository } from 'src/app/user/user.repository';
import { createNewBookDto } from "./dtos/create-new-book-dto";
import { GenreRepository } from '../genre/genre.repository';
import { Genre } from "../genre/genre.entity";
import { UpdateResult } from 'typeorm';
import { InvalidBookInputException } from "./exceptions/invalid-book-input.exception"
import { InvalidGenreException } from '../genre/exceptions/invalid-genre.exception';

@Injectable()
export class BookService {
  
  constructor(
    @InjectRepository(BookRepository)
    private readonly bookRepository: BookRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(GenreRepository)
    private readonly genreRepository: GenreRepository,
  ) {}

  async findBookByName(bookName: string): Promise<Book> {

    const rBook2 = await this.bookRepository.findByName(bookName);
    if (rBook2 == null) { 
      BookNotFoundException.byName(bookName);
    }
    return rBook2;

  }

  async findBookById(bookId: number): Promise<Book> {

    const rBook2 = await this.bookRepository.findById(bookId);
    if (rBook2 == null) { 
      BookNotFoundException.byId(bookId);
    }
    return rBook2;

  }

  async getAllBooks(): Promise<Book[] | undefined> {
    return await this.bookRepository.findAll();
  }

  async uploadBook(createBookDto: createNewBookDto, uId: string): Promise<Book> {

    const user = await this.userRepository.findByUId(uId);
    if(user == null){
        UserNotFoundException.byUId();
    }

    // Fetch all Genre entities based on genre IDs
    const genreEntities: Genre[] = [];
    for (const genreId of createBookDto.genres) {
      const genre = await this.genreRepository.findGenre(genreId);
      if (!genre) {
        InvalidGenreException.Invalid(genreId);
      }
      genreEntities.push(genre);
    }

    const { name, description, price, writer, pageNumber, datePublished,
        language, bookDimension, barcode, isbn, editionNumber, imagePath, genres
    } = createBookDto;
    
    if ( price < 0 ){ InvalidBookInputException.Price(); }
    if ( pageNumber < 0 ){ InvalidBookInputException.PageNumber(); }
    
    const book = new Book();
    book.name = name;
    book.description = description;
    book.price = price;
    book.publisher = user;
    book.writer = writer;
    book.pageNumber = pageNumber;
    book.datePublished = datePublished;
    book.language = language;
    book.bookDimension = bookDimension;
    book.barcode = barcode;
    book.isbn = isbn;
    book.editionNumber = editionNumber;
    book.imagePath = imagePath;
    book.isDeleted = false;
    book.genres = genreEntities;

    return await this.bookRepository.save(book);

  }

  async deleteBook(bookId: number, uId: string): Promise<UpdateResult> {

    const rBook2 = await this.bookRepository.findById(bookId);
    if (rBook2 == null) {
      BookNotFoundException.byId(bookId);
    }
    const deleteResult = await this.bookRepository.update(bookId, { isDeleted: true });

    return deleteResult;

  }
}