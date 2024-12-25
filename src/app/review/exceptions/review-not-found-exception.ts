import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byBook( bookId: number ) {
    throw new ReviewNotFoundException(`Reviews at book ${bookId} not found`, HttpStatus.NOT_FOUND)
  }

}