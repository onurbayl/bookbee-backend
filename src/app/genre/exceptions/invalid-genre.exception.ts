import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGenreException extends HttpException {
  constructor(message: string = 'Invalid Genre', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static Invalid(id: number) {
    throw new InvalidGenreException(`Genre with ID ${id} is invalid`, HttpStatus.BAD_REQUEST)
  }

}