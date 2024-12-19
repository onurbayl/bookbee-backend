import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnauthorizedException extends HttpException {
  constructor(message: string = 'User is unauthorized', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byNotAdmin() {
    throw new UserUnauthorizedException(`Admin role is required to access this endpoint`, HttpStatus.UNAUTHORIZED);
  }

  static byNotPublisher() {
    throw new UserUnauthorizedException(`Publisher role is required to access this endpoint`, HttpStatus.UNAUTHORIZED);
  }

  static byNotPermitted() {
    throw new UserUnauthorizedException(`Access to this endpoint in an unpermitted way is forbidden`, HttpStatus.FORBIDDEN);
  }

  static byInvalidUid(uid: string) {
    throw new UserUnauthorizedException(`Unauthorized database write attempt`, HttpStatus.BAD_REQUEST)
  }

  static byNotOwnBook() {
    throw new UserUnauthorizedException(`The current publisher user does not own the book.`, HttpStatus.UNAUTHORIZED);
  }


}