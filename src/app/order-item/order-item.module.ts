import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderItemController } from "./order-item.controller";
import { OrderItemService } from "./order-item.service";
import { OrderItemRepository } from "./order-item.repository";
import { UserModule } from "../user/user.module";
import { BookModule } from "../book/book.module";

@Module({
    imports: [TypeOrmModule.forFeature([OrderItem]), UserModule, BookModule],
    controllers: [OrderItemController],
    providers: [OrderItemService, OrderItemRepository],
    exports: [OrderItemRepository],
})
export class OrderItemModule {}