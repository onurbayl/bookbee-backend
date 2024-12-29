import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderItemBadRequestException extends HttpException {
  constructor(message: string = 'Bad request', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static ByNonPositiveDays(days: number){
    throw new OrderItemBadRequestException(`To get order item data, specify a positive day number. You gave ${days}`, HttpStatus.BAD_REQUEST);
  }
}