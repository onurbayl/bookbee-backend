import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderRepository } from "./order.repository";

@Injectable()
export class OrderService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,
    ) {}

    //Add service methods

}