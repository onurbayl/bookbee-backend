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
import { bookWithDetailDTO } from './dtos/book-with-detail-dto';
import { DiscountRepository } from '../discount/discount.repository';
import { ReviewRepository } from '../review/review.repository';

@Injectable()
export class BookService {
  
  constructor(
    @InjectRepository(BookRepository)
    private readonly bookRepository: BookRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(GenreRepository)
    private readonly genreRepository: GenreRepository,

    @InjectRepository(DiscountRepository)
    private readonly discountRepository: DiscountRepository,

    @InjectRepository(ReviewRepository)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async findBookByName(bookName: string): Promise<Book> {

    const rBook2 = await this.bookRepository.findByName(bookName);
    if (rBook2 == null) { 
      BookNotFoundException.byName(bookName);
    }
    if ( rBook2.isDeleted ) {
      BookNotFoundException.deleted();
    }
    return rBook2;

  }

  async findBookById(bookId: number): Promise<Book> {

    const rBook2 = await this.bookRepository.findById(bookId);
    if (rBook2 == null) { 
      BookNotFoundException.byId(bookId);
    }
    if ( rBook2.isDeleted ) {
      BookNotFoundException.deleted();
    }
    return rBook2;

  }

  async getAllBooks(){

    const books = await this.bookRepository.findAll();

    let resultBooks = await Promise.all(books.map(async (item) => {
      const averageReviewScore = await this.reviewRepository.findAverageReviewScoreByBook(item.id);

      const discount = await this.discountRepository.findByBook(item.id);
      let discountPercentage = 0;
      let finalPrice = item.price;
      if( discount != null ){
        discountPercentage = discount.discountPercentage;
        finalPrice = parseFloat( ( item.price*(100-discount.discountPercentage)/100 ).toFixed(2) );
      }
    
      return new bookWithDetailDTO({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        publisher: item.publisher,
        genres: item.genres,
        writer: item.writer,
        pageNumber: item.pageNumber,
        datePublished: item.datePublished,
        language: item.language,
        bookDimension: item.bookDimension,
        barcode: item.barcode,
        isbn: item.isbn,
        editionNumber: item.editionNumber,
        imagePath: item.imagePath,
        isDeleted: item.isDeleted,
        averageReviewScore: averageReviewScore,
        discountPercentage: discountPercentage,
        finalPrice: finalPrice,
      });
    }));

    resultBooks = resultBooks.filter((book) => !book.isDeleted);

    resultBooks = resultBooks.sort((a, b) => {
      if (a.averageReviewScore > b.averageReviewScore) return -1;
      if (a.averageReviewScore < b.averageReviewScore) return 1;
      return 0;
    });

    return resultBooks;
  }

  async findPublisherBooks(uId: string) {
    const user = await this.userRepository.findByUId(uId);
    if(user == null){
      UserNotFoundException.byUId();
    }
    let resultBooks = await this.bookRepository.findByPublisher(user.id);
    resultBooks = resultBooks.filter((book) => !book.isDeleted);
    return resultBooks;
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