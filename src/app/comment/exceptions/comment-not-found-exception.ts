import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byReviewAndUser( reviewId: number, userId: number ) {
    throw new CommentNotFoundException(`Comment for review ID ${reviewId} and user ID ${userId} not found`, HttpStatus.NOT_FOUND)
  }

  static byId( commentId: number ) {
    throw new CommentNotFoundException(`Comment for ID ${commentId} not found`, HttpStatus.NOT_FOUND)
  }

  static byUser( userId: number ) {
    throw new CommentNotFoundException(`Comment for user ${userId} not found`, HttpStatus.NOT_FOUND)
  }

  static byReview( reviewId: number ) {
    throw new CommentNotFoundException(`Comment for review ${reviewId} not found`, HttpStatus.NOT_FOUND)
  }

  static noContent() {
    throw new CommentNotFoundException(`No content has been found`, HttpStatus.NOT_FOUND)
  }

}