import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadStatusRepository } from "./read-status.repository";
import { Book } from '../book/book.entity';
import { BookRepository } from '../book/book.repository';
import { BookNotFoundException } from '../book/exceptions/book-not-found.exception';
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { UserRepository } from 'src/app/user/user.repository';
import { ReadStatus } from "./read-status.entity";
import { InvalidStatusException } from "./exceptions/invalid-status.exception";

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

    async getReadStatus(userId: number): Promise<ReadStatus[]> {

        const targetUser = await this.userRepository.findById(userId);
        if( targetUser == null ){
            UserNotFoundException.byId(userId);
        }
    
        return await this.readStatusRepository.getReadStatusForUser(userId);
    
    }

    async setReadStatus(
        bookId: number,
        uId: string,
        status_number: number,
    ): Promise<ReadStatus> {

        if (status_number !== 0 && status_number !== 1 && status_number !== 2){
            throw new InvalidStatusException.Invalid();
        }

        let status: string;

        if (status_number === 0){
            status = "Already Read";
        }
        else if (status_number === 1){
            status = "Reading"
        }
        else if (status_number === 2){
            status = "Will Read"
        }

        else {
            throw new InvalidStatusException.Invalid();
        }

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
                throw new UserNotFoundException.byUId();
            }

            if (!book) {
                throw new BookNotFoundException.byId(bookId);
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