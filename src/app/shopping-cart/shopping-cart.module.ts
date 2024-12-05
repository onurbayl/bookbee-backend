import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShoppingCart } from "./shopping-cart.entity";
import { ShoppingCartController } from "./shopping-cart.controller";
import { ShoppingCartService } from "./shopping-cart.service";
import { ShoppingCartRepository } from "./shopping-cart.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ShoppingCart])],
    controllers: [ShoppingCartController],
    providers: [ShoppingCartService, ShoppingCartRepository],
    exports: [ShoppingCartRepository],
})
export class ShoppingCartModule {}