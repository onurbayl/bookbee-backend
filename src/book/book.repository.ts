import { Injectable } from '@nestjs/common';
import { DataSource, Brackets, Repository } from 'typeorm';
import { Book } from "./book.entity";
import { exampleDTO } from "./dtos/example-dto"

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(private readonly  dataSource: DataSource) {
        super(Book, dataSource.createEntityManager());
    }

    //I know this part is a bit complex and annoying. 
    
    //Custom queries will be written here. - Some queries are written by default like delete and save.
    //You can check it when calling this class. Before you guys ask, orm makes check for sql injection.
    async findByName(iName : string): Promise<exampleDTO | undefined> {

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

        if (!book) {
            return undefined; // or throw an exception if needed
        }

        // Transform the result into DTO
        const bookDTO: exampleDTO = {
            id: book.id,
            name: book.name,
            description: book.description,
            price: book.price,
            publisherName: book.publisher.name, // Access the publisher's name
            writer: book.writer,
            pageNumber: book.pageNumber,
            datePublished: book.datePublished,
            language: book.language,
            bookDimension: book.bookDimension,
            barcode: book.barcode,
            isbn: book.isbn,
            editionNumber: book.editionNumber,
            imagePath: book.imagePath,
            isDeleted: book.isDeleted,
        };

        return bookDTO;
    }

    //Get only book related info
    /*return this.createQueryBuilder('book')
        .leftJoinAndSelect('book.publisher', 'publisher') //Without this we dont have access to publisher object
        .where( 'book.name = :bookname', { bookname: iName} ) //.orWhere() and .andWhere() to chain conditions
        .getOne(); //.getMany() if a list expected. Note: if two books return .getone() throws error.*/

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
        .orWhere( 'book.name = GirayinMacerlari', { bookname: iName})
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