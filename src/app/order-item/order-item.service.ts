import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItemRepository } from "./order-item.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { OrderItemBadRequestException } from "./exceptions/order-item-bad-request.exception";

@Injectable()
export class OrderItemService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(OrderItemRepository)
        private readonly orderItemRepository: OrderItemRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async findLastNSales(userUid: string, nDays: number) {
        if (nDays < 1) {
            OrderItemBadRequestException.ByNonPositiveDays(nDays);
        }
        const user = await this.userRepository.findByUId(userUid);
        if (user == null) {
            UserNotFoundException.byUId();
        }
        let orderData = await this.orderItemRepository.findSalesGroup(user.id);
        
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - nDays);

        // Generate all dates for the past n days
        const allDates = [];
        for (let d = new Date(startDate); d < today; d.setDate(d.getDate() + 1)) {
            allDates.push(new Date(d).toISOString().split('T')[0]); // YYYY-MM-DD format
        }

        // Create a map of data for quick lookup
        const dataMap = new Map(orderData.map(item => [new Date(item.date).toISOString().split('T')[0], [parseInt(item.quantity), parseInt(item.revenue)]]));

        // Fill missing dates with zero sales
        const filledData = allDates.map(date => {
            const entry = dataMap.get(date) || [0, 0]; // Default to [0, 0] if undefined
            return {
                date: date,
                quantity: entry[0], 
                revenue: entry[1]  
            };
        });

        return filledData;
    }
}