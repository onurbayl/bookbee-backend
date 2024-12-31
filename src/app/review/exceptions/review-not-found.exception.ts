import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }
  
  static byUser( userId: number ) {
    throw new ReviewNotFoundException(`Reviews by user ${userId} not found`, HttpStatus.NOT_FOUND)
  }

  static byBookAndUser( bookId: number, userId: number ) {
    throw new ReviewNotFoundException(`Review for book ID ${bookId} and user ID ${userId} not found`, HttpStatus.NOT_FOUND)
  }

  static byBook( bookId: number ) {
    throw new ReviewNotFoundException(`Reviews at book ${bookId} not found`, HttpStatus.NOT_FOUND)
  }

  static byId( reviewId: number ) {
    throw new ReviewNotFoundException(`Review for ID ${reviewId} not found`, HttpStatus.NOT_FOUND)
  }

}