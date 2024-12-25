import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static noContent() {
    throw new CommentNotFoundException(`No content has been found`, HttpStatus.NOT_FOUND)
  }

}