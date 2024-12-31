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
    ){

        let status: string;

        if (status_number == 0){
            status = "Already Read";
        }
        else if (status_number == 1){
            status = "Reading"
        }
        else if (status_number == 2){
            status = "Will Read"
        }
        else {
            InvalidStatusException.Invalid();
        }

        // Find the existing ReadStatus if it exists
        // getReadStatus already checks if the book whose status is gonna change is belong to user
        // If the book is not belong to user, then "else" works and new ReadStatus created and saved.
        let readStatus = await this.readStatusRepository.getReadStatus(bookId, uId);
    
        if (readStatus) {
            if( readStatus.status == status ){
                await this.readStatusRepository.delete(readStatus);
                return { message: 'The read status has been deleted.' }
            }
            // Update the existing ReadStatus
            readStatus.status = status;
            readStatus.readDate = new Date();
        }    
        else {
            // Create a new ReadStatus
            const user = await this.userRepository.findByUId(uId);
            const book = await this.bookRepository.findById(bookId);
    
            if (!user) {
                UserNotFoundException.byUId();
            }

            if (!book) {
                BookNotFoundException.byId(bookId);
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

    async getReadStatusByBook(bookId: number, uId: string) {

        const targetUser = await this.userRepository.findByUId(uId);
        if( targetUser == null ){
            return { status: null };
        }

        const book = await this.bookRepository.findById(bookId);
        if ( book == null ) {
            BookNotFoundException.byId(bookId);
        }
    
        const status = await this.readStatusRepository.getReadStatus(bookId, targetUser.uid);

        if ( status == null ){
            return { status: null };
        }
        else if (status.status == "Already Read"){
            return { status: 0 };
        }
        else if (status.status == "Reading"){
            return { status: 1 };
        }
        else if (status.status == "Will Read"){
            return { status: 2 };
        }
    
    }

}