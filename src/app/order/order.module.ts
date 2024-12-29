import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { UserModule } from "../user/user.module";
import { ShoppingCartModule } from "../shopping-cart/shopping-cart.module";
import { CartItemModule } from "../cart-item/cart-item.module";
import { DiscountModule } from "../discount/discount.module";
import { CouponModule } from "../coupon/coupon.module";
import { OrderItemModule } from "../order-item/order-item.module";
import { CustomerAddressModule } from "../customer-address/customer-address.module";
import { EmailModule } from "src/mailer/email.module";

@Module({
    imports: [TypeOrmModule.forFeature([Order]), UserModule, ShoppingCartModule, CustomerAddressModule, CartItemModule, DiscountModule, CouponModule, OrderItemModule, EmailModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: [OrderRepository],
})
export class OrderModule {}