import { HttpException, HttpStatus } from '@nestjs/common';

export class CartItemNotFoundException extends HttpException {
  constructor(message: string = 'Cart Item not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byBookAndUser( bookId: number, userId ) {
    throw new CartItemNotFoundException(`Cart Item for book ID ${bookId} and user ID ${userId} not found`, HttpStatus.NOT_FOUND)
  }

}