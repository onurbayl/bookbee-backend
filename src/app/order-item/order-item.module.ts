import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderItemController } from "./order-item.controller";
import { OrderItemService } from "./order-item.service";
import { OrderItemRepository } from "./order-item.repository";

@Module({
    imports: [TypeOrmModule.forFeature([OrderItem])],
    controllers: [OrderItemController],
    providers: [OrderItemService, OrderItemRepository],
    exports: [OrderItemRepository],
})
export class OrderItemModule {}