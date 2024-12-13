import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "./cart-item.entity";
import { CartItemController } from "./cart-item.controller";
import { CartItemService } from "./cart-item.service";
import { CartItemRepository } from "./cart-item.repository";
import { UserModule } from "../user/user.module";
import { BookModule } from "../book/book.module";
import { ShoppingCartModule } from "../shopping-cart/shopping-cart.module";
import { DiscountModule } from "../discount/discount.module";

@Module({
    imports: [TypeOrmModule.forFeature([CartItem]), ShoppingCartModule, UserModule, BookModule, DiscountModule],
    controllers: [CartItemController],
    providers: [CartItemService, CartItemRepository],
    exports: [CartItemRepository],
})
export class CartItemModule {}