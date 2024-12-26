import { HttpException, HttpStatus } from '@nestjs/common';

export class RestrictedBookOpException extends HttpException {
  constructor(message: string = 'Unauthorized operation', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static Upload() {
    throw new RestrictedBookOpException(`You are not authorized to upload a book.`, HttpStatus.FORBIDDEN)
  }

  static Delete() {
    throw new RestrictedBookOpException(`You are not authorized to delete a book.`, HttpStatus.FORBIDDEN)
  }

}