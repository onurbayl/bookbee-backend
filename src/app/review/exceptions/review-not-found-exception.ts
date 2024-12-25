import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static reviewExists( bookId: number, userId: number ) {
    throw new ReviewNotFoundException(`Review for book ${bookId} by user ${userId} already exists`, HttpStatus.NOT_FOUND)
  }

  static byScoreOrContent() {
    throw new ReviewNotFoundException(`Review does not contain a score or a content`, HttpStatus.NOT_FOUND)
  }

  static invalidScore() {
    throw new ReviewNotFoundException(`Given score is an invalid value`, HttpStatus.NOT_FOUND)
  }

}