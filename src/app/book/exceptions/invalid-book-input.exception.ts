import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidBookInputException extends HttpException {
  constructor(message: string = 'Invalid book feature', statusCode: HttpStatus) { //You need to define constructor for exception class
    super(message, statusCode);
  }

  static Price() { //Each case can be defined like that and used in service layer (rarely in controller too.)
    throw new InvalidBookInputException(`Price cannot be lower than 0`, HttpStatus.BAD_REQUEST)
  }

  static PageNumber() { //Also use appropriate HttpStatus. You can check it in internet.
    throw new InvalidBookInputException(`Page number cannot be lower than 0`, HttpStatus.BAD_REQUEST)
  }

}