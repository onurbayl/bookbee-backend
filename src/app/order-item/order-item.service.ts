import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemRepository } from "./order-item.repository";

@Injectable()
export class OrderItemService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(OrderItemRepository)
        private readonly orderItemRepository: OrderItemRepository,
    ) {}

    //Add service methods

}