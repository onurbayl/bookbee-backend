import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerAddressNotFoundException extends HttpException {
  constructor(message: string = 'Customer address not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byId() {
    throw new CustomerAddressNotFoundException('The customer address is not found.', HttpStatus.NOT_FOUND);
  }

  static byUserId() {
    throw new CustomerAddressNotFoundException('The customer address for given user is not found', HttpStatus.NOT_FOUND);
  }

}