import { HttpException, HttpStatus } from "@nestjs/common";

export class OrderNotFoundException extends HttpException {
  constructor(message: string = 'Bad request', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static byId(id: number){
    throw new OrderNotFoundException(`The order with ID ${id} not found.`, HttpStatus.BAD_REQUEST);
  }

}