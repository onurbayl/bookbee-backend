import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, Brackets, Repository } from 'typeorm';
import { Book } from "./book.entity";
import { createNewBookDto } from "./dtos/create-new-book-dto";
import { User } from '../user/user.entity';
import { Genre } from "../genre/genre.entity";
import { error } from 'console';

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(private readonly  dataSource: DataSource) {
        super(Book, dataSource.createEntityManager());
    }

    async findByName(iName : string): Promise<Book | undefined> {

        return this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .leftJoinAndSelect('book.genres', 'genres')
        .where( 'book.name = :bookname', { bookname: iName} ) 
        .getOne();

    }

    async findById(bookId: number): Promise<Book | undefined> {
        return this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .leftJoinAndSelect('book.genres', 'genres')
        .where( 'book.id = :book_id', {book_id: bookId})
        .getOne();
    }

    async findAll(): Promise<Book[] | undefined> {
        return await this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .leftJoinAndSelect('book.genres', 'genres').getMany();
    }

    async uploadBook(createBookDto: createNewBookDto , user: User, genreEntities: Genre[]): Promise<Book> {
        
        const { name, description, price, writer, pageNumber, datePublished,
            language, bookDimension, barcode, isbn, editionNumber, imagePath, genres
         } = createBookDto;
        
        if ( price < 0 ){ throw new BadRequestException({
            statusCode: 400,
            message: ['Price cannot be lower than 0'],
            error: 'Validation Error',
          }); }
        if ( pageNumber < 0 ){throw new BadRequestException({
            statusCode: 400,
            message: ['Page Number cannot be lower than 0'],
            error: 'Validation Error',
          });}
        
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

        return await this.save(book);
    }

}