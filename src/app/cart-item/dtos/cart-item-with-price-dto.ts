import { Book } from "src/app/book/book.entity";

export class cartItemWithPriceDto{

    id: number;
    book: Book;
    quantity: number;
    normalPrice: number;
    discountPercentage: number;
    finalPrice: number;

}