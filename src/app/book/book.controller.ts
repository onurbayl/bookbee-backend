import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { BookService } from './book.service';  // Import the service
import { Book } from './book.entity';  // Import the Book entity

@Controller('api/v1/book') // "api/v1" is standart naming convension for version, using it like this good practice
export class BookController {
  constructor(private readonly bookService: BookService) {} //Rarely needed another service, if need arise ask me.

  /*
  - @Body() <variable name>: <type> 
  This is how we read body, you need to use dtos (mostly in data insertion) for mapping and names should match.
  - @Query('<name>') <variable name>: <type>
  This is how you get queries. name and variable name can be different.
  - @Param('<name>') <variable name>: <type>
  This is how you get params from api url. name and variable name can be different.
  - @Headers() if we need header data.
    */
  @Get('example-api') // This api point is 'GET /api/v1/book/example-api'.
  async findBookByName(@Query('name') name: string): Promise<Book> {
    const book = await this.bookService.findBookByName(name);
    return book; //response handler kullan.
  }

}