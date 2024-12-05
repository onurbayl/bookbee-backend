import { Controller } from "@nestjs/common";
import { DiscountService } from "./discount.service";

@Controller('api/v1/discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) {}

    //Add api endpoints

}