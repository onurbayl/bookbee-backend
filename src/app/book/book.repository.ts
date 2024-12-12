import { Injectable } from '@nestjs/common';
import { DataSource, Brackets, Repository } from 'typeorm';
import { Book } from "./book.entity";

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(private readonly  dataSource: DataSource) {
        super(Book, dataSource.createEntityManager());
    }

    //I know this part is a bit complex and annoying. 

    async findByName(iName : string): Promise<Book | undefined> {

        //Query builder - for complex cases
        return this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher') //Without this we dont have access to publisher object
        .where( 'book.name = :bookname', { bookname: iName} ) //.orWhere() and .andWhere() to chain conditions
        .getOne();

        /*
        //Library method - for simple cases
        return this.findOne({
        where: { name: iName }, //you can chain conditions like in the comment //{ name: iName, id:1 }
        relations: ["publisher"], //also you need to include relations of relations, "publisher.like_genre" if you want to use it.
        });
        */

    }

    async findById(bookId: number): Promise<Book | undefined> {
        return this.createQueryBuilder('book')
        .where( 'book.id = :book_id', {book_id: bookId})
        .getOne();
    }

    //Get only book related info
    /* getting certain columns
    const book = await this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .where('book.name = :bookname', { bookname: iName })
        .select([
            'book.id',
            'book.name',
            'book.description',
            'book.price',
            'publisher.name', // Selecting publisher name
            'book.writer',
            'book.pageNumber',
            'book.datePublished',
            'book.language',
            'book.bookDimension',
            'book.barcode',
            'book.isbn',
            'book.editionNumber',
            'book.imagePath',
            'book.isDeleted',
        ])
        .getOne(); 
    */

    // .orderBy('book.id', 'DESC') //Example usage for order

    /* This is an example for join column between entities.

    .leftJoinAndSelect('book.publisher', 'user')
    .where('user.name = :publisherName', { publisherName: 'John Doe' })  // Filter by publisher's name
    */

    // .select([ 'book.id', 'book.name' ]) //To select some columns or getting extra data. 
    // Put it under joins(not before) and use dtos to map it. (ask ChatGPT)

    /* Complex example: This one is a complex example

    ### TypeORM query
    return this.createQueryBuilder('book')
    .where( new Brackets( qb => {
        qb.andWhere('book.name = :bookname', { bookname: iName})
        .orWhere( 'book.name = GirayinMacerlari' )
        })
    )
    .andWhere(
        new Brackets( qb => {
            qb.where('book.id = 1')
            .orWhere('book.name = Patates')
        })
    )
    .getOne();

    ### SQL query
    SELECT *
    FROM book
    WHERE 
    (
        (book.name = :bookname OR book.name = 'GirayinMacerlari')
    )
    AND 
    (
        (book.id = 1 OR book.name = 'Patates')
    )
    LIMIT 1;
    */

}