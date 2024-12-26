import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderBadRequestException extends HttpException {
  constructor(message: string = 'Bad request', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static ByEmptyCart(){
    throw new OrderBadRequestException('To request a purchase, the user cart should contain at least 1 item.', HttpStatus.BAD_REQUEST);
  }

}