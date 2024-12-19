import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountRepository } from "./discount.repository";
import { createNewDiscountDto } from "./dtos/create-new-discount-dto";
import { UserRepository } from "../user/user.repository";
import { BookRepository } from "../book/book.repository";
import { Discount } from "./discount.entity";
import { DiscountInvalidDataException } from "./exceptions/discount-invalid-data.exception";
import { BookNotFoundException } from "../book/exceptions/book-not-found.exception";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { UserUnauthorizedException } from "../user/exceptions/user-unauthorized.exception";

@Injectable()
export class DiscountService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(DiscountRepository)
        private readonly discountRepository: DiscountRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,

        @InjectRepository(BookRepository)
        private readonly bookRepository: BookRepository,
    ) {}

    async addDiscountToDatabase(inputData: createNewDiscountDto, uId: string){

        const discountPercentage = inputData.discountPercentage;
        const startDate = new Date(inputData.startDate);
        const endDate = new Date(inputData.endDate);
        const bookId = inputData.bookId;
        
        const currentDate = new Date();

        if( discountPercentage == null || startDate == null || endDate == null || bookId == null){
            DiscountInvalidDataException.byMissingData(inputData);
        }

        const user = await this.userRepository.findByUId(uId);
        if( user == null ){
            UserNotFoundException.byUId();
        }

        const book = await this.bookRepository.findById(bookId);
        if( book == null ){
            BookNotFoundException.byId(bookId);
        }
        if( book.publisher.id != user.id ){
            UserUnauthorizedException.byNotOwnBook();
        }

        if( startDate.getTime() <= currentDate.getTime() ){
            DiscountInvalidDataException.byStartDate();
        }

        if( endDate.getTime() <= currentDate.getTime() ){
            DiscountInvalidDataException.byEndDate();
        }

        if( endDate.getTime() <= startDate.getTime() ){
            DiscountInvalidDataException.byDateOrder();
        }

        if( !( 5 <= discountPercentage && discountPercentage <= 100 ) ){
            DiscountInvalidDataException.byDiscountPercentage(discountPercentage);
        }

        const overlappingDiscount: Discount[] = await this.discountRepository.findOverlapByBook(bookId, startDate, endDate);
        if( overlappingDiscount.length != 0 ){
            DiscountInvalidDataException.byOverlappingDiscount();
        }

        const newDiscount = new Discount();
        newDiscount.book = book;
        newDiscount.discountPercentage = discountPercentage;
        newDiscount.startDate = startDate;
        newDiscount.endDate = endDate;

        return this.discountRepository.save(newDiscount);
    }

}