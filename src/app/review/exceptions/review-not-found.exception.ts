import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byBookAndUser( bookId: number, userId: number ) {
    throw new ReviewNotFoundException(`Review for book ID ${bookId} and user ID ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}