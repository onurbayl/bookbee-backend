import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }
  
  static byUser( userId: number ) {
    throw new ReviewNotFoundException(`Reviews by user ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}