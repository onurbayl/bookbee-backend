import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscountRepository } from "./discount.repository";

@Injectable()
export class DiscountService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(DiscountRepository)
        private readonly discountRepository: DiscountRepository,
    ) {}

    //Add service methods

}