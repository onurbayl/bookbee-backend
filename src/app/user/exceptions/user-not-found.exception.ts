import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message: string = 'User not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byId( id: number ) {
    throw new UserNotFoundException(`User with ID ${id} not found`, HttpStatus.NOT_FOUND)
  }

  static byUId( uid: string ) {
    throw new UserNotFoundException(`User with UID ${uid} not found`, HttpStatus.NOT_FOUND)
  }

}