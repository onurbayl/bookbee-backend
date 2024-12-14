import { HttpException, HttpStatus } from '@nestjs/common';

export class UserBadRequestException extends HttpException {
  constructor(message: string = 'Bad request', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static selfUnban() {
    throw new UserBadRequestException(`The users with administrative roles cannot unban themselves`, HttpStatus.BAD_REQUEST)
  }

  static selfBan() {
    throw new UserBadRequestException(`The users with administrative roles cannot ban themselves`, HttpStatus.BAD_REQUEST)
  }

  static byExistingUid() {
    throw new UserBadRequestException(`The user with given uId already exists`, HttpStatus.BAD_REQUEST)
  }

  static byExistingEmail(email: string) {
    throw new UserBadRequestException(`The user with email ${email} already exists`, HttpStatus.BAD_REQUEST)
  }

}