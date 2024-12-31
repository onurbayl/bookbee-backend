import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewBadRequestException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static reviewExists( bookId: number, userId: number ) {
    throw new ReviewBadRequestException(`You already reviewed this book`, HttpStatus.NOT_FOUND)
  }

  static byScoreOrContent() {
    throw new ReviewBadRequestException(`Review does not contain a score or a content`, HttpStatus.NOT_FOUND)
  }

  static invalidScore() {
    throw new ReviewBadRequestException(`Given score is an invalid value`, HttpStatus.NOT_FOUND)
  }

}