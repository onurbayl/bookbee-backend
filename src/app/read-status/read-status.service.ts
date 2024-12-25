import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadStatusRepository } from "./read-status.repository";
import { Book } from '../book/book.entity';
import { BookRepository } from '../book/book.repository';
import { BookNotFoundException } from '../book/exceptions/book-not-found.exception';
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { UserRepository } from 'src/app/user/user.repository';
import { ReadStatus } from "./read-status.entity";

@Injectable()
export class ReadStatusService {
    constructor(
        @InjectRepository(ReadStatusRepository)
        private readonly readStatusRepository: ReadStatusRepository,
        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async getReadStatus(bookId: number, uId: string): Promise<ReadStatus> {
    
        return await this.readStatusRepository.getReadStatus(bookId, uId);
    
    }

    async setReadStatus(
        bookId: number,
        uId: string,
        status: string,
    ): Promise<ReadStatus> {
        // Find the existing ReadStatus if it exists
        // getReadStatus already checks if the book whose status is gonna change is belong to user
        // If the book is not belong to user, then "else" works and new ReadStatus created and saved.
        let readStatus = await this.readStatusRepository.getReadStatus(bookId, uId);
    
        if (readStatus) {
            // Update the existing ReadStatus
            readStatus.status = status;
            readStatus.readDate = new Date();
        } 
        
        else {
            // Create a new ReadStatus
            const user = await this.userRepository.findOneBy({ uid: uId });
            const book = await this.bookRepository.findOneBy({ id: bookId });
    
            if (!user) {
                throw new Error('User not found');
            }

            if (!book) {
                throw new Error('Book not found');
            }

            let readDate = new Date();
    
            readStatus = this.readStatusRepository.create({
                user,
                book,
                status,
                readDate,
            });
        }
    
        // Save the ReadStatus (insert or update)
        return this.readStatusRepository.save(readStatus);
    }

}