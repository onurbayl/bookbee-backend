import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static noContent() {
    throw new CommentNotFoundException(`No content has been found`, HttpStatus.NOT_FOUND)
  }

  static byReview( reviewId: number ) {
    throw new CommentNotFoundException(`Comment for review ${reviewId} not found`, HttpStatus.NOT_FOUND)
  }

  static byUser( userId: number ) {
    throw new CommentNotFoundException(`Comment for user ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}