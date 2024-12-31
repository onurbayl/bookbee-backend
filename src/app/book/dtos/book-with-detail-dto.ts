import { Genre } from "src/app/genre/genre.entity";
import { User } from "src/app/user/user.entity";

export class bookWithDetailDTO{
    id: number;
    name: string;
    description: string;
    price: number;
    publisher : User;
    genres: Genre[];
    writer: string;
    pageNumber: number;
    datePublished: number;
    language: string;
    bookDimension: string;
    barcode: string;
    isbn: string;
    editionNumber: string;
    imagePath: string;
    isDeleted: boolean;
    averageReviewScore: number; //new
    wishlistNumber: number; //new
    discountPercentage: number; //new
    finalPrice: number; //new

    constructor(data: Partial<bookWithDetailDTO>) {
        Object.assign(this, data);
    }
}