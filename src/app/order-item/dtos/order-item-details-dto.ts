import { Book } from "src/app/book/book.entity";

export class orderItemDetailsDTO{
    id: number;
    book: Book;
    unitPrice: number;
    discountPercentage: number;
    discountedPrice: number;
    quantity: number;
    totalPrice: number;
}