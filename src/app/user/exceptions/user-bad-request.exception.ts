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

  static byNotEnoughBalance(id: number) {
    throw new UserBadRequestException(`The user with Id ${id} does not have enough balance to complete this transaction.`, HttpStatus.BAD_REQUEST)
  }

  static byInvalidAmount(amount: number) {
    throw new UserBadRequestException(`The amount ${amount} must be greater than 0.`, HttpStatus.BAD_REQUEST)
  }

  static selfTransfer() {
    throw new UserBadRequestException(`You cannot transfer balance to yourself`, HttpStatus.BAD_REQUEST)
  }

}