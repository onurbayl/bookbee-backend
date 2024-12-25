import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewLikeDislikeNotFoundException extends HttpException {
  constructor(message: string = 'Review not found', statusCode: HttpStatus) {
    super(message, statusCode);
  }

  static unabletoLikeDislike(){
    throw new ReviewLikeDislikeNotFoundException(`The existing record could not be liked or disliked`, HttpStatus.NOT_FOUND)
  }

}