import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "./cart-item.entity";
import { CartItemController } from "./cart-item.controller";
import { CartItemService } from "./cart-item.service";
import { CartItemRepository } from "./cart-item.repository";

@Module({
    imports: [TypeOrmModule.forFeature([CartItem])],
    controllers: [CartItemController],
    providers: [CartItemService, CartItemRepository],
    exports: [CartItemRepository],
})
export class CartItemModule {}