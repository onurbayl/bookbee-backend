import { HttpException, HttpStatus } from '@nestjs/common';

export class ShoppingCartNotFoundException extends HttpException {
  constructor(message: string = 'Shopping Cart not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byId( id: number ) {
    throw new ShoppingCartNotFoundException(`Shopping Cart with user ID ${id} not found`, HttpStatus.NOT_FOUND)
  }

}