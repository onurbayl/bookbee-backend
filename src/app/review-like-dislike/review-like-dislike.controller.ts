import { Controller } from "@nestjs/common";
import { ReviewLikeDislikeService } from "./review-like-dislike.service";

@Controller('api/v1/review-like')
export class ReviewLikeDislikeController {
    constructor(private readonly reviewLikeDislikeService: ReviewLikeDislikeService) {}

    //Add api endpoints

}