import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byUser( userId: number ) {
    throw new CommentNotFoundException(`Comment for user ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}