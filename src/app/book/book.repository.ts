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

    async findByPublisher(userId: number): Promise<Book[]> {
        return this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .leftJoinAndSelect('book.genres', 'genres')
        .where('publisher.id = :i_publisher', {i_publisher: userId})
        .getMany();
    }
}