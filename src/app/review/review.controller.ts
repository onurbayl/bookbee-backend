import { Controller } from "@nestjs/common";
import { ReviewService } from "./review.service";

@Controller('api/v1/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    //Add api endpoints

}