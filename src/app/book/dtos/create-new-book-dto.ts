
/*
This is an example DTO object that we can use. This one will be used when a new book is inserted.
Contains information that we will get from publisher. Request body will be mapped to this.
If form variable names and dto variable names are same, it can map it automaticly.

Example:
https://stackoverflow.com/questions/66422241/how-to-add-dto-in-nestjs

Also DTOs can be use to return response without some info like password, balance or security related infos.
In our project, security is not important. *sad Hakan noises* So we wont use it that much.

Another usage is preventing bidirectional data relations. If we dont, our response becomes infinite recursive.
In our project, data relations are unidirectional. It wont be a problem.
*/

export class createNewBookDto {
    name: string;
    description: string;
    price: number;
    writer: string;
    pageNumber: number;
    datePublished: number;
    language: string;
    bookDimension: string;
    barcode: string;
    isbn: string;
    editionNumber: string;
    imagePath: string;
    genres: number[]; //Bring genres choices as id.
}