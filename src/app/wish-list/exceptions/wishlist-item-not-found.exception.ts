import { HttpException, HttpStatus } from '@nestjs/common';

export class WishListItemNotFoundException extends HttpException {
  constructor(message: string = 'Wish List Item not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byBookAndUser( bookId: number, userId: number ) {
    throw new WishListItemNotFoundException(`Wish List Item for book ID ${bookId} and user ID ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}