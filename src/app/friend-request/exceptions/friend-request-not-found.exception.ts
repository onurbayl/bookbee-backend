import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendRequestNotFoundException extends HttpException {
  constructor(message: string = 'Friendship request not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static bySenderAndReceiver( senderId: number, receiverId: number ) {
    throw new FriendRequestNotFoundException(`Friendship request with sender ID ${senderId} and receiver ID ${receiverId} not found`, HttpStatus.NOT_FOUND)
  }

  static between( senderId: number, receiverId: number ) {
    throw new FriendRequestNotFoundException(`Friendship between users with ID ${senderId} and ID ${receiverId} not found`, HttpStatus.NOT_FOUND)
  }
  
}