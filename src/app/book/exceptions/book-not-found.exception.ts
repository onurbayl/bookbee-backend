import { HttpException, HttpStatus } from '@nestjs/common';

export class BookNotFoundException extends HttpException {
  constructor(message: string = 'Book not found', statusCode: HttpStatus) { //You need to define constructor for exception class
    super(message, statusCode);
  }

  static byId( id: number ) { //Each case can be defined like that and used in service layer (rarely in controller too.)
    throw new BookNotFoundException(`Book with ID ${id} not found`, HttpStatus.NOT_FOUND)
  }

  static byName( name: string ) { //Also use appropriate HttpStatus. You can check it in internet.
    throw new BookNotFoundException(`Book with name ${name} not found`, HttpStatus.NOT_FOUND)
  }

}