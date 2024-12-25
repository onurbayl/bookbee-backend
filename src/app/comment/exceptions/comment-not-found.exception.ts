import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byReview( reviewId: number ) {
    throw new CommentNotFoundException(`Comment for review ${reviewId} not found`, HttpStatus.NOT_FOUND)
  }

}