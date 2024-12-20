import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomerAddressInvalidDataException extends HttpException {
  constructor(message: string = 'Invalid customer address input data is given', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byMissingData() {
    throw new CustomerAddressInvalidDataException('The customer address is missing in input data.', HttpStatus.BAD_REQUEST)
  }

}