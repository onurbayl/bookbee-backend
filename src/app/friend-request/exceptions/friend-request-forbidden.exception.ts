import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendRequestForbiddenException extends HttpException {
  constructor(message: string = 'Friendship request already aswered', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static bySenderAndReceiver( senderId: number, receiverId: number ) {
    throw new FriendRequestForbiddenException(`Friendship between sender with ID ${senderId} and receiver with ID ${receiverId} already established`, HttpStatus.FORBIDDEN)
  }

}