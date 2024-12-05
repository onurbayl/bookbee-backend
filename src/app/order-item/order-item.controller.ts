import { Controller } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";

@Controller('api/v1/order-item')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) {}

    //Add api endpoints

}