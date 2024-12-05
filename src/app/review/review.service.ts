import { Injectable } from "@nestjs/common";
import { ReviewRepository } from "./review.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ReviewService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,
    ) {}

    //Add service methods

}