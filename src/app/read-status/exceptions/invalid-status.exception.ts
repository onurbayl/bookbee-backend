import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidStatusException extends HttpException {
  constructor(message: string = 'Invalid Status', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static Invalid() {
    throw new InvalidStatusException(`Invalid Status`, HttpStatus.BAD_REQUEST)
  }

}